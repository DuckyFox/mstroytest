import type { TreeStore } from '../stores/TreeStore';
import type { TreeItem } from '../stores/types';

export interface AgGridTreeItem extends TreeItem {
    path: string[];
    category: 'Группа' | 'Элемент';
}

export function transformTreeToAgGrid(store: TreeStore): AgGridTreeItem[] {
    const result: AgGridTreeItem[] = [];

    for (const item of store.getAll()) {
        const parents = store.getAllParents(item.id);
        const path = parents.reverse().map((p) => String(p.id));

        const hasChildren = store.getChildren(item.id).length > 0;

        result.push({
            id: item.id,
            label: item.label,
            path,
            category: hasChildren ? 'Группа' : 'Элемент',
        });
    }

    return result;
}
