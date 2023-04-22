
  <template>
<!-- <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" closable @tab-remove="removeTab" @tab-click="clickTab">
  <el-tab-pane
    :key="item.name"
    v-for="(item, index) in editableTabs"
    :label="item.title"
    :name="item.name">
  </el-tab-pane>
</el-tabs> -->
  </template>
  <!-- <script>
    import { useRouter } from 'vue-router'
    const router = useRouter()
    export default {
      data() {
        return {
        //   editableTabsValue: this.$store.state.editableTabsValue,
        //   editableTabs:  this.$store.state.editableTabs,
        }
      },
      computed:{
        editableTabs:{
            get(){
                return this.$store.state.editableTabs
            },
            set(val){
                 this.$store.state.editableTabs = val
            }
        },
        editableTabsValue:{
            get(){
                return this.$store.state.editableTabsValue
            },
            set(val){
                this.$store.state.editableTabsValue = val
            }
        }
      },
      methods: {
        removeTab(targetName) {
            
         console.log(targetName)
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;

          if(activeName == 'index'){
            return;
          }
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);

          useRouter().push({name:activeName})
        },
        clickTab(target){
            console.log(target)
            router.push({name:target.props.label});
        }
      }
    }
  </script> -->