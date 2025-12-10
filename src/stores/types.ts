export type parentId = number | string | null;
export type id = number | string;

export interface TreeItem {
    id: id;
    parent: parentId;
    label: string;
}
