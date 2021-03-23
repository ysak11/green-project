<template>
  <div class="info-collect">

    <div class="container">

      <!-- 关闭按钮 -->
      <svg class="icon close" aria-hidden="true" @click="closeWindow">
        <use xlink:href="#icon-guanbi2"></use>
      </svg>

      <!-- 书签按钮 -->
      <div class="button">
        <div @click="toWhole">信息总览</div>
        <div @click="toWorker">职工信息</div>
      </div>
      
      <!-- 信息总览 -->
      <div class="wholeInfo" v-show="showWhole">
        <!-- 头部信息 -->
        <h3>问题统计</h3>
        <div class="header">
          <div>
            <div class="num">{{waittingNum}}</div>
            <div>待解决问题</div>
          </div>
          <div>
            <div class="num">{{solvingNum}}</div>
            <div>正在处理问题</div>
          </div>
          <div>
            <div class="num">{{solvedNum}}</div>
            <div>已解决问题</div>
          </div>
        </div>
        
        <!-- 信息总览 -->
        <h3>最近信息</h3>
        <div class="outer" ref="scroll">
          <div class="content">
            <ul>
              <li v-for="item in reverseList" :key="item._id" class="tip">
                <span v-if="item.status === 'waitting' || item.status === 'invalid'">
                  {{`${item.date} 职工 ${item.workerName} 上报了区域 ${item.areaName} 存在的问题："${item.message}" `}}
                </span>
                <span v-else-if="item.status === 'solved'">
                  {{`${item.date} 职工 ${item.workerName} 解决了区域 ${item.areaName} 存在的问题："${item.message}" `}}
                </span>
                <span v-else-if="item.status === 'warn' || item.status === 'warned' || item.status === 'water'">
                  {{`${item.date}. ${item.message} `}}
                </span>
              </li>
            </ul>
            <!-- <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
              <li>6</li>
              <li>7</li>
              <li>8</li>
              <li>9</li>
              <li>10</li>
              <li>11</li>
              <li>12</li>
              <li>13</li>
              <li>14</li>
              <li>15</li>
              <li>16</li>
              <li>17</li>
              <li>18</li>
              <li>19</li>
              <li>20</li>
              <li>21</li>
              <li>22</li>
              <li>23</li>
              <li>24</li>
              <li>25</li>
              <li>26</li>
              <li>27</li>
              <li>28</li>
              <li>29</li>
              <li>30</li>
              <li>31</li>
              <li>32</li>
              <li>33</li>
              <li>34</li>
              <li>35</li>
              <li>36</li>
              <li>37</li>
              <li>38</li>
              <li>39</li>
              <li>40</li>
              <li>41</li>
              <li>42</li>
              <li>43</li>
              <li>44</li>
              <li>45</li>
              <li>46</li>
              <li>47</li>
              <li>48</li>
              <li>49</li>
              <li>50</li>
              <li>51</li>
              <li>52</li>
              <li>53</li>
              <li>54</li>
              <li>55</li>
              <li>56</li>
              <li>57</li>
              <li>58</li>
              <li>59</li>
              <li>60</li>
              <li>61</li>
              <li>62</li>
              <li>63</li>
              <li>64</li>
              <li>65</li>
              <li>66</li>
              <li>67</li>
              <li>68</li>
              <li>69</li>
              <li>70</li>
              <li>71</li>
              <li>72</li>
              <li>73</li>
              <li>74</li>
              <li>75</li>
              <li>76</li>
              <li>77</li>
              <li>78</li>
              <li>79</li>
              <li>80</li>
              <li>81</li>
              <li>82</li>
              <li>83</li>
              <li>84</li>
              <li>85</li>
              <li>86</li>
              <li>87</li>
              <li>88</li>
              <li>89</li>
              <li>90</li>
              <li>91</li>
              <li>92</li>
              <li>93</li>
              <li>94</li>
              <li>95</li>
              <li>96</li>
              <li>97</li>
              <li>98</li>
              <li>99</li>
              <li>100</li>
            </ul> -->

          </div>
        </div>
      </div>

      <!-- 职工信息 -->
      <div class="workerInfo" v-show="!showWhole">
        <!-- 侧边栏 -->
        <div class="slide" ref="slide">
          <div class="workerList">
            <div v-for="item in workerList" :key="item._id" :class="{active: item._id === activeId}" @click="choose(item)">
              {{item.username}}
            </div>

            <!-- <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
              <li>6</li>
              <li>7</li>
              <li>8</li>
              <li>9</li>
              <li>10</li>
              <li>11</li>
              <li>12</li>
              <li>13</li>
              <li>14</li>
              <li>15</li>
              <li>16</li>
              <li>17</li>
              <li>18</li>
              <li>19</li>
              <li>20</li>
              <li>21</li>
              <li>22</li>
              <li>23</li>
              <li>24</li>
              <li>25</li>
              <li>26</li>
              <li>27</li>
              <li>28</li>
              <li>29</li>
              <li>30</li>
              <li>31</li>
              <li>32</li>
              <li>33</li>
              <li>34</li>
              <li>35</li>
              <li>36</li>
              <li>37</li>
              <li>38</li>
              <li>39</li>
              <li>40</li>
              <li>41</li>
              <li>42</li>
              <li>43</li>
              <li>44</li>
              <li>45</li>
              <li>46</li>
              <li>47</li>
              <li>48</li>
              <li>49</li>
              <li>50</li>
              <li>51</li>
              <li>52</li>
              <li>53</li>
              <li>54</li>
              <li>55</li>
              <li>56</li>
              <li>57</li>
              <li>58</li>
              <li>59</li>
              <li>60</li>
              <li>61</li>
              <li>62</li>
              <li>63</li>
              <li>64</li>
              <li>65</li>
              <li>66</li>
              <li>67</li>
              <li>68</li>
              <li>69</li>
              <li>70</li>
              <li>71</li>
              <li>72</li>
              <li>73</li>
              <li>74</li>
              <li>75</li>
              <li>76</li>
              <li>77</li>
              <li>78</li>
              <li>79</li>
              <li>80</li>
              <li>81</li>
              <li>82</li>
              <li>83</li>
              <li>84</li>
              <li>85</li>
              <li>86</li>
              <li>87</li>
              <li>88</li>
              <li>89</li>
              <li>90</li>
              <li>91</li>
              <li>92</li>
              <li>93</li>
              <li>94</li>
              <li>95</li>
              <li>96</li>
              <li>97</li>
              <li>98</li>
              <li>99</li>
              <li>100</li>
            </ul> -->

          </div> 
        </div>

        <!-- 内容区 -->
        <div class="content">
          <!-- 职工的基本信息 -->
          <div class="content-top">
            <div class="name">职工名称： {{worker.username}}</div>
            <div class="finish">
              <span>本年度完成任务数： {{workerRec.length}}</span>
              <span>{{`(灌溉任务${waterNum}次，上报问题${subNum}次，其它类型任务${solveNum}次)`}}</span>
            </div>
            <span class="status">状态：空闲中</span>
          </div>

          <h3>具体记录</h3>
          <!-- 具体记录 -->
          <div class="detail" ref="detail">
            <div class="detail-content">
              <ul v-show="workerRec.length !== 0">
                <li v-for="item in workerRec" :key="item._id"  class="tip">
                  <span v-if="item.status === 'waitting' || item.status === 'invalid'">
                    {{`${item.date} 职工 ${item.workerName} 上报了区域 ${item.areaName} 存在的问题："${item.message}" `}}
                  </span>
                  <span v-else-if="item.status === 'solved'">
                    {{`${item.date} 职工 ${item.workerName} 解决了区域 ${item.areaName} 存在的问题："${item.message}" `}}
                  </span>
                  <span v-else-if="item.status === 'water'">
                    {{`${item.date}. ${item.message} `}}
                  </span>
                </li>
              </ul>

              <div v-show="workerRec.length === 0" class="nothing">该职工暂时没有任务记录...</div>

            </div>
          </div>

        </div>

      </div>


    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BScroll from 'better-scroll';

import { reqUserList, reqMessageList } from '@/api';

export default {
  name: "InfoCollect",
  data() {
    return {
      workerList: [],           //职工列表
      showWhole: true,         //显示信息总览界面
      bscrollW: null,           //总览页面滚动插件
      bscrollS: null,           //职工侧边栏滚动插件
      bscrollD: null,           //具体情况的滚动插件
      activeId: '',             //选中的职工的id
      worker: {},               //选中的职工
    }
  },
  computed: {
    ...mapState(['messageList']),
    //反转数组才能让数组第一条是最新的信息
    reverseList() {
      return this.messageList.slice().reverse();
    },
    //待处理的问题数
    waittingNum() {
      return this.messageList.filter(item => item.status === 'waitting').length;
    },
    //正在处理的问题数
    solvingNum() {
      return this.messageList.filter(item => item.status === 'solving').length;
    },
    //已解决的问题数
    solvedNum() {
      return this.messageList.filter(item => item.status === 'solved').length;
    },
    //职工的记录(注意是反转后的)
    workerRec() {
      return this.reverseList.filter(item => item.workerName === this.worker.username);
    },
    //职工灌溉任务次数
    waterNum() {
      return this.workerRec.filter(item => item.status === 'water').length;
    },
    //上报问题次数
    subNum() {
      return this.workerRec.filter(item => item.status === 'waitting' || item.status === 'invalid').length;
    },
    //解决问题次数
    solveNum() {
      return this.workerRec.filter(item => item.status === 'solved').length;
    }
  },
  async created() {
    //获取职工列表
    const result = await reqUserList('2');
    if(result.status === 0) {
      this.workerList = result.data;
    };
  },
  mounted() {
    //绑定BScroll组件
    this.bscrollW = new BScroll(this.$refs.scroll, {
      probeType: 0
    });

    this.bscrollS = new BScroll(this.$refs.slide, {
      probeType: 0
    })

    this.bscrollD = new BScroll(this.$refs.detail, {
      probeType: 0
    })
  },
  methods: {
    //关闭窗口
    closeWindow(e) {
      this.$emit('closeWindow');
    },

    //显示信息总览界面
    toWhole() {
      this.showWhole = true;
      
      //需要等主要DOM渲染完成后进行刷新（重新计算高度），否则很可能不能滚动
      setTimeout(() => {
        this.bscrollW.refresh();
      })
    },

    //显示职工信息界面
    toWorker() {
      this.showWhole = false;
      
      //第一次进入时默认选中第一位职工
      if(JSON.stringify(this.worker) === '{}') {
        this.choose(this.workerList[0]);
      }
      //需要等主要DOM渲染完成后进行刷新（重新计算高度），否则很可能不能滚动
      setTimeout(() => {
        this.bscrollS.refresh();
        this.bscrollD.refresh();
      })
    },

    //查看选中职工的信息
    choose(worker) {
      this.activeId = worker._id;
      this.worker = worker;
      //需要等主要DOM渲染完成后进行刷新（重新计算高度），否则很可能不能滚动
      setTimeout(() => {
        this.bscrollD.refresh();
      })
    },
  }
}
</script>

<style scoped>
  .info-collect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .3);
    z-index: 3;
  }

  .container {
    width: 700px;
    height: 500px;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 40px;
    /* background-image: linear-gradient(to bottom right, #718093, #353b48); */
    background-image: linear-gradient( #40739e, #192a56);
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    color: #c23616;
    cursor: pointer;
  }

  .close:hover {
    color: #e84118;
  }

  .button {
    position: absolute;
    width: 130px;
    top: 40px;
    left: -100px;
    display: flex;
    flex-direction: column;
  }

  .button > div {
    box-sizing: border-box;
    position: relative;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    color: #fff;
    background-color: #44bd32;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button > div:hover {
    background-color: #4cd137;
  }

  .header {
    display: flex;
  }

  .header > div {
    flex: 1;
    height: 80px;
    text-align: center;
    box-sizing: border-box;
    border-right: 2px solid #fff;
  }

  .header > div:nth-last-child(1) {
    border: none;
  }

  .num {
    font-size: 32px;
    padding: 10px 0;
  }

  .outer {
    width: 100%;
    height: 240px;
    background-color: rgba(255, 255, 255, .3);
    border-radius: 8px;
    overflow: hidden;
  }

  .workerInfo {
    height: 100%;
    position: relative;
    display: flex;
  }

  .slide {
    height: 100%;
    width: 100px;
    border-right: 1px solid #fff;
    overflow: hidden;
  }

  .workerList > div {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
  }

  .workerList > div:hover {
    background-color: #192a56;
  }

  .active {
    background-color: #192a56;
  }

  .content {
    flex: 1;
    padding: 10px 20px;
  }

  .content-top {
    width: 100%;
    height: 110px;
    position: relative;
  }

  .tip {
    padding-bottom: 8px;
  }

  .name {
    font-size: 20px;
    padding: 16px 0;
  }

  .finish {
    display: flex;
    flex-direction: column;
  }

  .finish span {
    padding-top: 10px;
  }

  .status {
    position: absolute;
    top: 50%;
    right: 36px;
    transform: translateY(-50%);
  }

  .detail {
    width: 100%;
    height: 280px;
    background-color: rgba(255, 255, 255, .3);
    position: relative;
    overflow: hidden;
  }

  .detail-content {
    padding-top: 5px;
  }
  .nothing {
    margin: 12px;
  }
  
  /* .button button::after {
    content: '';
    border: 15px solid;
    border-color: transparent transparent transparent #718093;
    position: absolute;
    right: -29px;
  } */

</style>