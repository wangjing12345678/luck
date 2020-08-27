<template>
    <div class="box">
        <div class="cricle-content" v-if="luckArr.length">
            <Turntable ref="circle" :luckArr="luckArr" @resultNotice="resultNotice"></Turntable>
            <div class="start-button" @click="start">
                <!--<div class="trangle"></div>-->
                <div class="start-button-area"><img src="../../assets/image/button.png" alt=""></div>
            </div>
        </div>

    </div>
</template>

<script>
    import Turntable from './turntable'

    export default {
        name: "raffle",
        data() {
            return {
                luckArr: [
                    {id: "1", itemname: "一等奖"},
                    {id: "2", itemname: "二等奖"},
                    {id: "3", itemname: "三等奖"},
                    {id: "4", itemname: "四等奖"},
                    {id: "5", itemname: "五等奖"},
                    {id: "6", itemname: "未中奖"}
                    ]


            }
        },
        components: {
            Turntable
        },
        mounted() {

        },
        methods: {
            sortdown(arr) {
                for (var i = 0; i < arr.length - 1; i++) {
                    for (var j = 0; j < arr.length - 1 - i; j++) {
                        if (arr[j].itemnum < arr[j + 1].itemnum) {
                            var temp = arr[j];
                            arr[j] = arr[j + 1];
                            arr[j + 1] = temp;
                        }
                    }
                }
                return arr;
            },
            start() {
                if (this.$refs.circle.currState == 'static' || this.$refs.circle.currState == 'stop') {
                    this.$refs.circle.luckNum = 6
                    this.$refs.circle.play()
                }
            },
            reset() {
                this.$refs.circle.reset()

            },
            resultNotice() {
                console.log('结束')
            }
        }
    }
</script>

<style scoped lang="scss">
    .box {
        font-size: 0.24rem;
        background: rgb(40, 90, 145);
        padding-bottom: 0.3rem;
        overflow-x: hidden;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
    }


    .cricle-content {
        left: 0.14rem;
        position: relative;
        min-height: 3.6rem;
        top: 4.6rem;
    }

    .start-button {
        position: absolute;
        width: 1.5rem;
        height: 1.5rem;
        /*background: #4BAAE2;*/
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
    }

    .start-button-area {
        position: absolute;
        width: 1.5rem;
        height: 1.5rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        /*background: #fff;*/
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .start-button-area img {
        width: 1.3rem;
    }





</style>
