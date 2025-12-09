import type {TreeItem} from "./types.ts";

export class TreeStore {
    // Оригинальный массив объектов
    private items: TreeItem[]
    // Дабы избежать полного перебора массива, я создам словарь Map, где id будет ключом
    // Таким образом полный проход будет осуществляться только при инициализации экземпляра
    private itemsMap: Map<string|number, TreeItem>
    private childrenMap: Map<string|number, TreeItem[]>
    // Создадим на старте массив дочерних элементов для каждой записи
    // Где ключом будет id, а значением массив дочерних элементов
    constructor(items:TreeItem[]) {
        this.items = items
        this.itemsMap = new Map(
            this.items.map(
                (item)=>[item.id, item]
            )
        )
        this.childrenMap = new Map([])
        this.itemsMap.forEach((item)=>{
            if (item.parent !== null) {
                const childItem = this.childrenMap.get(item.parent)
                if (!childItem) {
                    this.childrenMap.set(item.parent, [item])
                }
                else {
                    this.childrenMap.set(item.parent, [...childItem, item])
                }
            }
        })
    }
}