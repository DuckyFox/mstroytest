<template>
    <div style="height: 500px;">
        <ag-grid-vue
            :rowData="rowData"
            :columnDefs="colDefs"
            :getRowId="getRowId"
            :treeData="true"
            :getDataPath="getDataPath"
            :autoGroupColumnDef="autoGroupColumnDef"
            :theme="theme"
        />
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import { AgGridVue } from 'ag-grid-vue3';
import { themeAlpine } from 'ag-grid-community';
import type { ValueGetterParams, ColDef} from 'ag-grid-community';
import { TreeStore } from '../stores/TreeStore';
import { transformTreeToAgGrid } from '../utils/treeTransform';
import type { AgGridTreeItem } from '../utils/treeTransform';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { TreeDataModule, LicenseManager  } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([ AllCommunityModule, TreeDataModule ]);
LicenseManager.setLicenseKey("[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-115010}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{8 January 2026}____[v3]_[0102]_MTc2NzgzMDQwMDAwMA==3093b9a9c04d034bc97b71a0b35bf226");

const props = defineProps<{
    store: InstanceType<typeof TreeStore>;
}>();

const rowData = ref<AgGridTreeItem[]>([]);

onMounted(() => {
    const data = transformTreeToAgGrid(props.store);
    console.log('Row data on mount:', data);
    console.log('Row data length:', data.length);
    rowData.value = data;
});

const getDataPath = (data: AgGridTreeItem) => {
    console.log(data.path)
    return data.path;
};

const getRowId = (p: { data: AgGridTreeItem }) => {
    console.log(p.data.path.join('/'))
    return p.data.path.join('/');
};

const theme = themeAlpine;

const autoGroupColumnDef: ColDef = {
    cellRendererParams: {
        suppressCount: true
    }
};

const colDefs: ColDef<AgGridTreeItem>[] = [
    {
        headerName: '№ п/п',
        width: 100,
        valueGetter: (params: ValueGetterParams<AgGridTreeItem>) => {
            return params.node?.rowIndex != null ? params.node.rowIndex + 1 : '';
        },
        sortable: false,
        filter: false,
    },
    {
        field: 'category',
        headerName: 'Категория',
        width: 150,
    },
    {
        field: 'label',
        headerName: 'Наименование',
        flex: 1,
        cellRenderer: 'agGroupCellRenderer',
    }
]


</script>