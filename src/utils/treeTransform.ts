import type { TreeStore } from '../stores/TreeStore';
import type { TreeItem } from '../stores/types';

export interface AgGridTreeItem extends TreeItem {
    path: string[];
    category: 'Группа' | 'Элемент';
}

export function transformTreeToAgGrid(store: TreeStore): AgGridTreeItem[] {
    const allItems = store.getAll();
    const result: AgGridTreeItem[] = [];

    for (const item of allItems) {
        const parents = store.getAllParents(item.id);

        const path = parents
            .reverse()
            .map(parent => String(parent.id));

        const hasChildren = store.getChildren(item.id).length > 0;
        const category: 'Группа' | 'Элемент' = hasChildren ? 'Группа' : 'Элемент';
        result.push({
            ...item,
            path: path,
            category: category
        });
    }

    return result;
}