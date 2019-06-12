<script>
import { Doughnut } from "vue-chartjs";

export default {
    name:'Chart',
    extends:Doughnut,
    props:{
        chartdata:{
            type: Object
        },
        options:{
            type: Object
        }
    },
    watch:{
        chartdata(){
            this.renderChart(this.chartdata, this.options)
        }
    },
    mounted(){
        this.renderChart(this.chartdata, this.options)
    }
}
</script>
