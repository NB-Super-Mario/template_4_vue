import Vue from 'vue';
import { Component, Prop, Watch, PropSync } from 'vue-property-decorator';
import './style.less';
import WithRender from './tpl.html';

// import Element from 'element-ui';

// import 'element-ui/lib/theme-chalk/index.css';

@WithRender
@Component
export default class StateTag extends Vue {
  @Prop()
  private attendance!: any[];
  @Prop()
  private currentDate!: string;

  get state() {
    const current = this.attendance.find((item: any) => item.checkDate === this.currentDate);
    if (current) {
      const time = parseInt(current.duration);
      if (time >= 9) {
        return 'success';
      } else if (time < 9) {
        return 'warning';
      }
    }
    return '';
  }

  get current() {
    return this.attendance.find((item: any) => item.checkDate === this.currentDate);
  }
}
