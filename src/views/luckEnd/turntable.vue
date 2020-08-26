<template>
    <div>
        <div class="circle">
            <div class="circle-in" ref="rotate-content" :id="elId" :class="currState"
                 @transitionend="_transEnd"
                 @webkitTransitionEnd="_transEnd">
                <div class="circle-white">
                    <div class="prize-content" v-for="(item,index) in luckArr" :key="index">
                        <div class="prize-content-word">{{ item.itemname }}</div>

                    </div>
                    <div class="prize" v-for="(item,index) in luckArr"
                         :style="{background:(index%2) == 0?'#fff':'rgb(251,201,142)'}">
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

    const STATE = {
        STATIC: 'static', //静止状态：默认，指针向上，旋转归零
        BRAKE: 'brake',
        STOP: 'stop'
    }
    const randomRange = (a, b) => {
        let arr = a > b ? [b, a] : [a, b];
        return Math.floor(Math.random() * (arr[1] - arr[0] + 1)) + arr[0];
    }
    export default {
        name: "turntable",
        props: ['luckArr'],
        data() {
            return {
                el: null,
                elId: 0,
                currState: STATE.STATIC,
                deg: 0,
                flag: 0,
                degArr: [],
                randomDeg: '',
                // 误差范围
                errorDeg: 10,
                luckNum: ''
            }
        },
        computed: {
            degNum() {
                return this.luckArr.length
            }
        },
        created() {
            this.elId = `__roulette_${this._uid}_${new Date().getTime()}`;
        },
        mounted() {
            this.el = document.getElementById(this.elId);
            var that = this
            this.$nextTick(() => {
                document.querySelectorAll('.prize').forEach(function (item, i) {
                    // item.style.backgroundColor = '#' + (~~(Math.random() * (1 << 24))).toString(16);
                    // 公式 90-360/个
                    // item.style.transform = 'rotate(' + (360 / that.degNum * (i + 1))+ 'deg)skewX('+(90-(360/that.degNum))+'deg)';
                    // 第一个角公式
                    var first = 90 - (360 / that.degNum / 2)
                    if (i == 0) {
                        item.style.transform = 'rotate(' + first + 'deg)skewX(' + (90 - (360 / that.degNum)) + 'deg)';
                    } else {
                        item.style.transform = 'rotate(' + (first + (360 / that.degNum) * i) + 'deg)skewX(' + (90 - (360 / that.degNum)) + 'deg)';
                    }
                })
                document.querySelectorAll('.prize-content').forEach(function (item, i) {
                    var first = 90 - (360 / that.degNum / 2)
                    if (i == 0) {
                        item.style.transform = 'rotate(' + first + 'deg)'
                    } else {
                        item.style.transform = 'rotate(' + (first + (360 / that.degNum) * i) + 'deg)'
                    }
                })
            })
            this.calcDeg()
        },
        methods: {
            play() {
                if (this.currState == STATE.STATIC || this.currState == STATE.STOP) {
                    this.calcRandomDeg()
                    this.flag += 15
                    var playDeg = 0
                    if (this.luckNum == 1) {
                        var arrIndex = Math.floor(Math.random() * 2)
                        playDeg = this.randomDeg[arrIndex]
                    } else {
                        playDeg = this.randomDeg
                    }
                    console.log(playDeg)
                    this.deg = this.flag * 360 + (-playDeg)
                    // this.deg =-playDeg
                    console.log(this.deg)
                    var time = 5
                    setTimeout(() => {
                        this.currState = STATE.BRAKE;
                        this.el.style.cssText =
                            `-webkit-transform:rotate(${this.deg}deg);
							-webkit-transition-duration:${time}s;
							transform:rotate(${this.deg}deg);
							transition-duration:${time}s`
                    }, 20)
                } else {
                    console.log('旋转不可点击')
                }
            },
            calcRandomDeg() {
                var obj = this.degArr.find(item => {
                    return item.id == this.luckNum
                })
                if (this.luckNum == 1) {
                    var num1 = Math.floor(Math.random() * (obj.range1[1] - obj.range1[0] + 1)) + obj.range1[0]
                    var num2 = Math.floor(Math.random() * (obj.range2[1] - obj.range2[0] + 1)) + obj.range2[0]
                    this.randomDeg = [num1, num2]
                } else {
                    this.randomDeg = Math.floor(Math.random() * (obj.range1[1] - obj.range1[0] + 1)) + obj.range1[0]
                }
            },
            calcDeg() {
                var aveDeg = 360 / this.degNum
                for (var i = 0; i < this.luckArr.length; i++) {
                    if (i == 0) {
                        var rangeStart = 360 - aveDeg / 2
                        var rangeEnd = aveDeg / 2
                        var range1 = [(0 + this.errorDeg), (rangeEnd - this.errorDeg)]
                        var range2 = [(rangeStart + this.errorDeg), (360 - this.errorDeg)]
                        var obj = {
                            id: this.luckArr[i].id,
                            range1: range1,
                            range2: range2
                        }
                        this.degArr.push(obj)
                    } else {
                        var range1 = [((aveDeg / 2) + (aveDeg * (i - 1)) + this.errorDeg), ((aveDeg / 2) + (aveDeg * i) - this.errorDeg)]
                        var obj = {
                            id: this.luckArr[i].id,
                            range1: range1,
                        }
                        this.degArr.push(obj)
                    }

                }
                console.log(this.degArr)
            },
            reset() {
                this.currState = STATE.STATIC;
                this.deg = 0
                this.flag = 0
                this.randomDeg = ''
                this.el.style.cssText =
                    `-webkit-transform:rotate(${this.deg}deg);
							-webkit-transition-duration:0s;
							transform:rotate(${this.deg}deg);
							transition-duration:0s`
            },
            _transEnd() {
                if (this.currState == STATE.BRAKE) {
                    this.currState = STATE.STOP;
                }
                this.$emit('resultNotice')
            }
        }
    }
</script>

<style scoped lang="scss">
    .circle {
        width: 3.6rem;
        height: 3.6rem;
        border-radius: 50%;
        /*background: #4BAAE2;*/
        margin: 0 auto;
    }

    .circle-in {
        width: 3.6rem;
        height: 3.6rem;
        border-radius: 50%;
        /*background: #CCE6FA;*/
        margin: auto;
        /*padding: 0.2rem;*/
    }

    .circle-white {
        width: 3.6rem;
        height: 3.6rem;
        border-radius: 50%;
        background: #fff;
        margin: auto;
        /*border: 0.04rem solid #4BAAE2;*/
        position: relative;
        overflow: hidden;
        /*transition: all 0.s;*/
        transition: transform 0.1s linear 0s;
        transform: rotate(180deg);
    }

    .prize {
        position: absolute;
        transform-origin: left top;
        left: 1.8rem;
        top: 1.8rem;
        width: 1.8rem;
        height: 1.8rem;
        /*border: 0.02rem solid #4BAAE2;*/
        box-sizing: border-box;
    }

    .prize-content {
        position: absolute;
        transform-origin: left top;
        left: 1.8rem;
        top: 1.8rem;
        width: 1.8rem;
        height: 1.8rem;
        /*border: 0.02rem solid #4BAAE2;*/
        box-sizing: border-box;
        z-index: 99;
    }

    .prize-content-word {
        width: 1rem;
        height: 1rem;
        transform: rotate(120deg);
        position: absolute;
        top: 0.08rem;
        left: 0.5rem;
        color: rgb(212, 49, 75);
        word-break: break-all;
        font-size: 0.3rem;
        font-weight: bold;
    }

    .static,
    .trans,
    .brake {
        -webkit-transform: rotate(0deg);
        -webkit-transition-property: -webkit-transform;
        -webkit-transition-timing-function: ease-out;
        transform: rotate(0deg);
        transition-property: transform;
        transition-timing-function: ease-out;
    }

    .play {
        -webkit-animation-name: play--rotate;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-timing-function: linear;
        animation-name: play--rotate;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    @-webkit-keyframes play--rotate {
        from {
            -webkit-transform: rotate(0deg)
        }

        to {
            -webkit-transform: rotate(360deg)
        }
    }

    @keyframes play--rotate {
        from {
            transform: rotate(0deg)
        }

        to {
            transform: rotate(360deg)
        }
    }

</style>
