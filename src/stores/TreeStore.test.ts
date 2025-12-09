import { TreeStore } from './TreeStore';
import { mockTree } from './mockData';
// import type { TreeItem } from './types';
import {beforeEach, describe, it, expect} from "vitest";

describe('TreeStore', () => {
    let store: TreeStore;

    beforeEach(() => {
        store = new TreeStore(mockTree)
    })

    describe('getAll', () => {
        it('должен вернуть все элементы', () => {
            const all = store.getAll();
            expect(all).toHaveLength(8)
        })
        it('должен вернуть массив TreeItem', () => {
            const all = store.getAll();
            all.forEach(item => {
                expect(item).toHaveProperty('id');
                expect(item).toHaveProperty('parent');
                expect(item).toHaveProperty('label');
            });
        });


        it('должен вернуть все элементы из mockTree', () => {
            const all = store.getAll();
            const ids = all.map(item => item.id);
            expect(ids).toContain(1);
            expect(ids).toContain('91064cee');
            expect(ids).toContain(3);
            expect(ids).toContain(4);
            expect(ids).toContain(5);
            expect(ids).toContain(6);
            expect(ids).toContain(7);
            expect(ids).toContain(8);
        });

        it('должен вернуть пустой массив для пустого store', () => {
            const emptyStore = new TreeStore([]);
            expect(emptyStore.getAll()).toHaveLength(0);
        });

        it('должен вернуть массив', () => {
            const all = store.getAll();
            expect(Array.isArray(all)).toBe(true);
        });
    })

    describe('getItem', () => {
        it('должен вернуть элемент по существующему id', () => {
            const item = store.getItem(1);
            expect(item.id).toBe(1);
            expect(item.label).toBe('Айтем 1');
            expect(item.parent).toBe(null);
        });

        it('должен вернуть элемент по строковому id', () => {
            const item = store.getItem('91064cee');
            expect(item.id).toBe('91064cee');
            expect(item.label).toBe('Айтем 2');
            expect(item.parent).toBe(1);
        });

        it('должен выбросить ошибку для несуществующего id', () => {
            expect(() => {
                store.getItem(999);
            }).toThrow('Данной записи не существует');
        });

        it('должен выбросить ошибку для несуществующего строкового id', () => {
            expect(() => {
                store.getItem('несуществующий');
            }).toThrow('Данной записи не существует');
        });

        it('должен вернуть правильный элемент с правильными свойствами', () => {
            const item = store.getItem(4);
            expect(item).toEqual({
                id: 4,
                parent: '91064cee',
                label: 'Айтем 4'
            });
        });
    })

    describe('getChildren', () => {
        it('должен вернуть прямых детей для элемента с детьми', () => {
            const children = store.getChildren(1);
            expect(children).toHaveLength(2);
            expect(children.map(c => c.id)).toContain('91064cee');
            expect(children.map(c => c.id)).toContain(3);
        });

        it('должен вернуть пустой массив для элемента без детей', () => {
            const children = store.getChildren(3);
            expect(children).toHaveLength(0);
        });

        it('должен вернуть всех прямых детей для строкового id', () => {
            const children = store.getChildren('91064cee');
            expect(children).toHaveLength(3);
            expect(children.map(c => c.id)).toContain(4);
            expect(children.map(c => c.id)).toContain(5);
            expect(children.map(c => c.id)).toContain(6);
        });

        it('должен вернуть пустой массив для несуществующего id', () => {
            const children = store.getChildren(999);
            expect(children).toHaveLength(0);
        });

        it('должен вернуть правильную структуру детей', () => {
            const children = store.getChildren(4);
            expect(children).toHaveLength(2);
            expect(children[0]).toHaveProperty('id');
            expect(children[0]).toHaveProperty('parent');
            expect(children[0]).toHaveProperty('label');
        });

        it('должен вернуть детей с правильным parent', () => {
            const children = store.getChildren('91064cee');
            children.forEach(child => {
                expect(child.parent).toBe('91064cee');
            });
        });
    })
    describe('getAllChildren', () => {
        it('должен вернуть всех потомков рекурсивно', () => {
            const allChildren = store.getAllChildren(1);
            expect(allChildren).toHaveLength(7);
            expect(allChildren.map(c => c.id)).toContain('91064cee');
            expect(allChildren.map(c => c.id)).toContain(3);
            expect(allChildren.map(c => c.id)).toContain(4);
            expect(allChildren.map(c => c.id)).toContain(5);
            expect(allChildren.map(c => c.id)).toContain(6);
            expect(allChildren.map(c => c.id)).toContain(7);
            expect(allChildren.map(c => c.id)).toContain(8);
        });

        it('должен вернуть всех потомков для элемента с вложенными детьми', () => {
            const allChildren = store.getAllChildren('91064cee');
            expect(allChildren).toHaveLength(5);
            expect(allChildren.map(c => c.id)).toContain(4);
            expect(allChildren.map(c => c.id)).toContain(5);
            expect(allChildren.map(c => c.id)).toContain(6);
            expect(allChildren.map(c => c.id)).toContain(7);
            expect(allChildren.map(c => c.id)).toContain(8);
        });

        it('должен вернуть всех потомков для элемента с глубокой вложенностью', () => {
            const allChildren = store.getAllChildren(4);
            expect(allChildren).toHaveLength(2);
            expect(allChildren.map(c => c.id)).toContain(7);
            expect(allChildren.map(c => c.id)).toContain(8);
        });

        it('должен вернуть пустой массив для элемента без детей', () => {
            const allChildren = store.getAllChildren(3);
            expect(allChildren).toHaveLength(0);
        });

        it('должен вернуть пустой массив для листового элемента', () => {
            const allChildren = store.getAllChildren(7);
            expect(allChildren).toHaveLength(0);
        });

        it('должен вернуть пустой массив для несуществующего id', () => {
            const allChildren = store.getAllChildren(999);
            expect(allChildren).toHaveLength(0);
        });

        it('не должен включать сам элемент в результат', () => {
            const allChildren = store.getAllChildren(1);
            expect(allChildren.map(c => c.id)).not.toContain(1);
        });

        it('должен вернуть всех потомков независимо от уровня вложенности', () => {
            const allChildren = store.getAllChildren(1);
            const ids = allChildren.map(c => c.id);
            expect(ids).toContain('91064cee');
            expect(ids).toContain(4);
            expect(ids).toContain(7);
        });
    })

    describe('getAllParents', () => {
        it('должен вернуть только сам элемент для корневого элемента', () => {
            const parents = store.getAllParents(1);
            expect(parents).toHaveLength(1);
            expect(parents[0]?.id).toBe(1);
        });

        it('должен вернуть элемент и его родителя', () => {
            const parents = store.getAllParents('91064cee');
            expect(parents).toHaveLength(2);
            expect(parents[0]?.id).toBe('91064cee');
            expect(parents[1]?.id).toBe(1);
        });

        it('должен вернуть всю цепочку родителей до корня', () => {
            const parents = store.getAllParents(7);
            expect(parents).toHaveLength(4);
            expect(parents[0]?.id).toBe(7);
            expect(parents[1]?.id).toBe(4);
            expect(parents[2]?.id).toBe('91064cee');
            expect(parents[3]?.id).toBe(1);
        });

        it('должен вернуть цепочку родителей для элемента с 3 уровнями', () => {
            const parents = store.getAllParents(4);
            expect(parents).toHaveLength(3);
            expect(parents[0]?.id).toBe(4);
            expect(parents[1]?.id).toBe('91064cee');
            expect(parents[2]?.id).toBe(1);
        });

        it('должен включать сам элемент в начало массива', () => {
            const parents = store.getAllParents(8);
            expect(parents[0]?.id).toBe(8);
        });

        it('должен вернуть правильный порядок от элемента к корню', () => {
            const parents = store.getAllParents(7);
            const ids = parents.map(p => p.id);
            expect(ids).toEqual([7, 4, '91064cee', 1]);
        });

        it('должен выбросить ошибку для несуществующего id', () => {
            expect(() => {
                store.getAllParents(999);
            }).toThrow('Данной записи не существует');
        });
    })
    describe('addItem', () => {
        it('должен добавить новый элемент в store', () => {
            const newItem = { id: 9, parent: null, label: 'Айтем 9' };
            store.addItem(newItem);
            expect(store.getItem(9)).toEqual(newItem);
        });

        it('должен добавить элемент с родителем', () => {
            const newItem = { id: 9, parent: 1, label: 'Айтем 9' };
            store.addItem(newItem);
            expect(store.getItem(9)).toEqual(newItem);
            const children = store.getChildren(1);
            expect(children.map(c => c.id)).toContain(9);
        });

        it('должен добавить элемент в childrenMap родителя', () => {
            const newItem = { id: 9, parent: '91064cee', label: 'Айтем 9' };
            store.addItem(newItem);
            const children = store.getChildren('91064cee');
            expect(children.map(c => c.id)).toContain(9);
        });

        it('должен добавить элемент без родителя', () => {
            const newItem = { id: 9, parent: null, label: 'Айтем 9' };
            store.addItem(newItem);
            expect(store.getItem(9)).toEqual(newItem);
            expect(store.getChildren(9)).toHaveLength(0);
        });

        it('должен перезаписать существующий элемент', () => {
            const updatedItem = { id: 1, parent: null, label: 'Обновленный Айтем 1' };
            store.addItem(updatedItem);
            expect(store.getItem(1).label).toBe('Обновленный Айтем 1');
        });
    })

    describe('updateItem', () => {
        it('должен обновить существующий элемент', () => {
            const updatedItem = { id: 1, parent: null, label: 'Обновленный Айтем 1' };
            store.updateItem(updatedItem);
            expect(store.getItem(1).label).toBe('Обновленный Айтем 1');
        });

        it('должен добавить элемент, если его не существует', () => {
            const newItem = { id: 9, parent: null, label: 'Айтем 9' };
            store.updateItem(newItem);
            expect(store.getItem(9)).toEqual(newItem);
        });

        it('должен изменить родителя элемента', () => {
            const updatedItem = { id: 3, parent: '91064cee', label: 'Айтем 3' };
            store.updateItem(updatedItem);
            expect(store.getItem(3).parent).toBe('91064cee');
            const oldParentChildren = store.getChildren(1);
            expect(oldParentChildren.map(c => c.id)).not.toContain(3);
            const newParentChildren = store.getChildren('91064cee');
            expect(newParentChildren.map(c => c.id)).toContain(3);
        });

        it('должен переместить элемент из одного родителя в другого', () => {
            const updatedItem = { id: 4, parent: 1, label: 'Айтем 4' };
            store.updateItem(updatedItem);
            expect(store.getItem(4).parent).toBe(1);
            const oldParentChildren = store.getChildren('91064cee');
            expect(oldParentChildren.map(c => c.id)).not.toContain(4);
            const newParentChildren = store.getChildren(1);
            expect(newParentChildren.map(c => c.id)).toContain(4);
        });

        it('должен переместить элемент от родителя к корню', () => {
            const updatedItem = { id: 4, parent: null, label: 'Айтем 4' };
            store.updateItem(updatedItem);
            expect(store.getItem(4).parent).toBe(null);
            const oldParentChildren = store.getChildren('91064cee');
            expect(oldParentChildren.map(c => c.id)).not.toContain(4);
        });

        it('должен переместить элемент от корня к родителю', () => {
            const updatedItem = { id: 1, parent: 4, label: 'Айтем 1' };
            store.updateItem(updatedItem);
            expect(store.getItem(1).parent).toBe(4);
            const newParentChildren = store.getChildren(4);
            expect(newParentChildren.map(c => c.id)).toContain(1);
        });

        it('не должен изменять childrenMap, если parent не изменился', () => {
            const childrenBefore = store.getChildren(1);
            const updatedItem = { id: '91064cee', parent: 1, label: 'Обновленный Айтем 2' };
            store.updateItem(updatedItem);
            const childrenAfter = store.getChildren(1);
            expect(childrenAfter.map(c => c.id)).toEqual(childrenBefore.map(c => c.id));
        });
    })

    describe('removeItem', () => {
        it('должен удалить элемент без детей', () => {
            store.removeItem(3);
            expect(() => store.getItem(3)).toThrow('Данной записи не существует');
        });

        it('должен удалить элемент и всех его потомков', () => {
            store.removeItem('91064cee');
            expect(() => store.getItem('91064cee')).toThrow('Данной записи не существует');
            expect(() => store.getItem(4)).toThrow('Данной записи не существует');
            expect(() => store.getItem(5)).toThrow('Данной записи не существует');
            expect(() => store.getItem(6)).toThrow('Данной записи не существует');
            expect(() => store.getItem(7)).toThrow('Данной записи не существует');
            expect(() => store.getItem(8)).toThrow('Данной записи не существует');
        });

        it('должен удалить элемент с глубокой вложенностью и всех потомков', () => {
            store.removeItem(4);
            expect(() => store.getItem(4)).toThrow('Данной записи не существует');
            expect(() => store.getItem(7)).toThrow('Данной записи не существует');
            expect(() => store.getItem(8)).toThrow('Данной записи не существует');
        });

        it('должен удалить элемент из childrenMap родителя', () => {
            store.removeItem(3);
            const children = store.getChildren(1);
            expect(children.map(c => c.id)).not.toContain(3);
        });

        it('должен удалить элемент и его потомков из childrenMap родителя', () => {
            store.removeItem('91064cee');
            const children = store.getChildren(1);
            expect(children.map(c => c.id)).not.toContain('91064cee');
        });

        it('не должен выбрасывать ошибку при удалении несуществующего элемента', () => {
            expect(() => {
                store.removeItem(999);
            }).not.toThrow();
        });

        it('должен удалить корневой элемент и всех его потомков', () => {
            store.removeItem(1);
            expect(() => store.getItem(1)).toThrow('Данной записи не существует');
            expect(store.getAll()).toHaveLength(0);
        });

        it('должен сохранить другие элементы при удалении', () => {
            store.removeItem(3);
            expect(store.getItem(1)).toBeDefined();
            expect(store.getItem('91064cee')).toBeDefined();
            expect(store.getAll()).toHaveLength(7);
        });
    })
})