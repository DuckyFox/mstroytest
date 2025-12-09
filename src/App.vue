<template>
    <div>
        <TreeTable :store="store" />
    </div>
</template>

<script setup lang="ts">
    import TreeTable from './components/TreeTable.vue';
    import { TreeStore } from './stores/TreeStore';
    import { mockTree } from './stores/mockData';

    const store = new TreeStore(mockTree);
</script>
