import type { TreeItem, id } from './types.ts';

export class TreeStore {
    private itemsMap: Map<id, TreeItem>;
    private childrenMap: Map<id, TreeItem[]>;

    constructor(items: TreeItem[]) {
        this.itemsMap = new Map(items.map((item) => [item.id, item]));

        this.childrenMap = new Map([]);

        this.itemsMap.forEach((item) => {
            if (item.parent !== null) {
                const childItem = this.childrenMap.get(item.parent);
                if (!childItem) {
                    this.childrenMap.set(item.parent, [item]);
                } else {
                    this.childrenMap.set(item.parent, [...childItem, item]);
                }
            }
        });
    }

    getAll(): TreeItem[] {
        return Array.from(this.itemsMap.values());
    }

    getItem(id: id): TreeItem {
        const item = this.itemsMap.get(id);
        if (!item) {
            throw new Error('Данной записи не существует');
        } else {
            return item;
        }
    }

    getChildren(id: id): TreeItem[] {
        return this.childrenMap.get(id) ?? [];
    }

    getAllChildren(id: id): TreeItem[] {
        const allChildren: TreeItem[] = [];
        const checkStack: TreeItem[] = [];

        const firstChildren = this.getChildren(id);
        checkStack.push(...firstChildren);

        while (checkStack.length > 0) {
            const current = checkStack.pop()!;
            allChildren.push(current);

            const children = this.getChildren(current.id);
            checkStack.push(...children);
        }
        return allChildren;
    }

    getAllParents(id: id): TreeItem[] {
        let current = this.getItem(id);
        if (current) {
            const allParents: TreeItem[] = [this.getItem(id)];
            while (current.parent !== null) {
                current = this.getItem(current.parent);
                allParents.push(current);
            }

            return allParents;
        } else {
            throw new Error('нет элемента');
        }
    }

    addItem(newItem: TreeItem) {
        this.itemsMap.set(newItem.id, newItem);
        this.childrenMap.set(newItem.id, this.getChildren(newItem.id));

        if (newItem.parent !== null) {
            this.childrenMap.set(newItem.parent, [...this.getChildren(newItem.parent), newItem]);
        }
    }

    updateItem(newItem: TreeItem) {
        const itemToUpdate = this.itemsMap.get(newItem.id);

        if (itemToUpdate) {
            if (itemToUpdate.parent !== newItem.parent) {
                if (itemToUpdate.parent !== null) {
                    const oldParentChildren = this.getChildren(itemToUpdate.parent);
                    const filtered = oldParentChildren.filter((child) => child.id !== newItem.id);
                    this.childrenMap.set(itemToUpdate.parent, filtered);
                }
                if (newItem.parent !== null) {
                    const newParentChildren = this.getChildren(newItem.parent);
                    this.childrenMap.set(newItem.parent, [...newParentChildren, newItem]);
                }
            }
            this.itemsMap.set(newItem.id, newItem);
        } else {
            this.addItem(newItem);
        }
    }

    removeItem(id: id) {
        const itemToRemove = this.itemsMap.get(id);
        if (!itemToRemove) {
            return;
        }

        const allChildren = this.getAllChildren(id);
        const idsToRemove = new Set([id, ...allChildren.map((child) => child.id)]);

        if (itemToRemove.parent !== null) {
            const parentChildren = this.getChildren(itemToRemove.parent);
            const filtered = parentChildren.filter((child) => !idsToRemove.has(child.id));
            this.childrenMap.set(itemToRemove.parent, filtered);
        }

        idsToRemove.forEach((id) => {
            this.childrenMap.delete(id);
        });

        idsToRemove.forEach((id) => {
            this.itemsMap.delete(id);
        });
    }
}
