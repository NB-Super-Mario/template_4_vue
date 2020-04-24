import Vue from 'vue';
import { Component, Prop, Watch, PropSync, Emit } from 'vue-property-decorator';
import { getAttendance } from '@/service/api';
import { getFisrtDateOfMonth, getLastDateOfMonth } from '@/utils/index';
import './style.less';
import WithRender from './tpl.html';
import StateTag from '@/components/state-tag';

// import Element from 'element-ui';

// import 'element-ui/lib/theme-chalk/index.css';

@WithRender
@Component({
  components: { StateTag },
})
export default class Calendar extends Vue {
  @Prop()
  private msg!: string;

  @Prop()
  private employeeCode!: string;

  value: string = '';
  beginDate: string = getFisrtDateOfMonth();

  endDate: string = getLastDateOfMonth();

  time: string = '';

  date: Date = new Date(); //初始化时间
  attendance: any[] = []; // 签到数据

  async getDate(employeeCode: string) {
    try {
      // const result = await getAttendance(employeeCode, this.beginDate, this.endDate);
      // console.log(result);
      //this.attendance = [...result];
    } catch (error) {
      console.log(error);
    }
  }

  @Watch('date')
  onDateChanged(val: string, oldVal: string) {
    const newBeginDate = getFisrtDateOfMonth(val);
    const oldBeginDate = getLastDateOfMonth(oldVal);
    if (val !== oldBeginDate) {
      this.beginDate = newBeginDate;
      this.endDate = getLastDateOfMonth(val);
      this.getDate(this.employeeCode);
    }
    console.log(`beginDate:${this.beginDate} endDate:${this.endDate} `);
  }
  @Watch('employeeCode')
  onEmployeeCodeChanged(val: string, oldVal: string) {
    if (val !== oldVal) {
      this.getDate(val);
    }
  }

  mounted() {
    this.getDate(this.employeeCode);
  }
}
