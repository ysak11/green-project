将index.js导入项目的main.js中，并使用Vue.use安装即可
在项目中使用this.$message.show()来调用这个方法，第一个参数为字符串形式，传入要显示的信息，第二第三个参数为布尔值，分别表示：是否显示拒绝按钮、是否显示遮罩
通过this.$message.onConfirm()传入一个函数来注册点击确定按钮后的回调函数
this.$message.onReject()注册拒绝按钮的回调函数