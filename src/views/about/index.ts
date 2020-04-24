import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { RouteMixin } from '@/utils/index';
import './style.less';
import WithRender from './tpl.html';

@WithRender
@Component({
  mixins: [RouteMixin],
})
export default class About extends Vue {
  @Prop()
  private msg!: string;
  mounted() {
    this.$message.success('删除记录成功');
  }
}
