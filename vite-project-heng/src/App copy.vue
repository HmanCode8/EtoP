<script setup></script>

<template>
  <div class="box">
    <h1>关于scss</h1>
    <div class="container">
      <div :class="`box-${index}`" v-for="index in 5" :key="index">Box {{ index }}</div>
    </div>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </div>
</template>

<style scoped lang="scss">
.box {
  $mycolor1: #f00;
  $mycolor: #f00;
  $myH: 10px;
  @mixin border-radis($deg) {
    border-radius: $deg;
  }
  h1 {
    color: #f00;
  }
  .container {
    @for $i from 1 through 5 {
      $colors: #3498db, #2ecc71, #e74c3c, #9b59b6, #f39c12; // 定义颜色列表
      .box-#{$i} {
        width: 50px;
        margin-right: 10px;
        @if $i % 2 == 0 {
          background-color: $mycolor;
          @include border-radis(50%);
          // height: 50px + 100px;
          margin: 10px 0;
        } @else {
          background-color: nth($colors, $i);
          height: 50px;
          @include border-radis(10%);
        } // 使用 nth 函数根据索引获取对应的颜色
        color: #fff;
        text-align: center;
        line-height: 50px;
      }
    }

    div {
    }
  }
}
</style>
