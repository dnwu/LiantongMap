<template>
<div class="login">
  <div class="box">
    <div class="title">基于移动通信大数据的群体行为预测和居民出行调查支持系统</div>
    <div class="login-box">
      <h3>登录</h3>
      <div class="name">
        <span class="icon icon-user"></span>
        <el-input
          placeholder="用户名"
          prefix-icon="icon-user"
          v-model="name">
        </el-input>
      </div>
      <div class="pass">
        <span class="icon icon-lock"></span>
        <el-input
          placeholder="密码"
          prefix-icon="icon-lock"
          type="password"
          @keyup.enter.native="login"
          v-model="pass">
        </el-input>
      </div>
      <div class="check">
        <el-checkbox v-model="checked">记住密码</el-checkbox>
      </div>
      <div class="btn">
        <el-button @click="login" type="primary">登录</el-button>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      name: "",
      pass: "",
      checked: true,
      userInfo: [
        {
          name: "admin",
          pass: "666666"
        }
      ]
    };
  },
  mounted() {
    this.name = window.localStorage.getItem("name");
    this.pass = window.localStorage.getItem("pass");
    if(this.judgeAuto()) {
      this.$router.push("/density");
    }
  },
  methods: {
    login() {
      this.userInfo.forEach(ele => {
        if (ele.name == this.name && ele.pass == this.pass) {
          if (this.checked) {
            this.saveLocalStorage({ name: this.name, pass: this.pass });
          } else {
            this.removeLocalStorage();
          }
          this.saveSessionStorage({ name: this.name, pass: this.pass });
          this.$router.push("/density");
        } else if (ele.name != this.name) {
          this.$message.error("该用户名不纯在");
        } else if (ele.pass != this.pass) {
          this.$message.error("密码错误");
        }
      });
    },
    saveLocalStorage({ name, pass }) {
      window.localStorage.setItem("name", name);
      window.localStorage.setItem("pass", pass);
    },
    removeLocalStorage() {
      window.localStorage.removeItem("name");
      window.localStorage.removeItem("pass");
    },
    saveSessionStorage({ name, pass }) {
      window.sessionStorage.setItem("name", name);
      window.sessionStorage.setItem("pass", pass);
    },
    // removeSessionStorage() {
    //   window.sessionStorage.removeItem("name");
    //   window.sessionStorage.removeItem("pass");
    // },
    judgeAuto() {
      var name = window.sessionStorage.getItem("name");
      var pass = window.sessionStorage.getItem("pass");
      if (name == null || pass == null) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("../config/css/icon.css");
$fontColor: #60c9e2;
.login {
  width: 100%;
  height: 100%;
  background-image: url("../assets/login_bg.jpg");
  background-size: cover;
  padding-top: 100px;
  .box {
    margin: 0 auto;
    width: 900px;
    height: 600px;
    background-image: url("../assets/login_box.png");
    background-size: contain;
    background-repeat: no-repeat;
    box-sizing: border-box;
    padding: 70px 90px 70px 70px;
    display: flex;
    flex-direction: column;
    .title {
      height: 31px;
      text-align: center;
      color: $fontColor;
      font-size: 24px;
    }
    .login-box {
      flex: 1;
      padding-left: 400px;
      h3 {
        color: $fontColor;
      }
      .name,
      .pass {
        position: relative;
        padding-right: 20px;
        margin: 40px 0;
        .icon {
          width: 30px;
          position: absolute;
          z-index: 99;
          color: $fontColor;
          font-size: 18px;
          text-align: center;
          line-height: 40px;
        }
      }
      .btn {
        margin-top: 30px;
        text-align: center;
      }
    }
  }
}
</style>
<style lang="scss">
.login {
  .el-input {
    .el-input__inner {
      background-color: transparent;
      border-radius: 0;
      border-color: transparent transparent rgba(255, 255, 255, 0.5) transparent;
      color: #60c9e2;
      &:focus {
        border-color: transparent transparent #60c9e2 transparent;
      }
    }
  }
  .el-checkbox__label {
    color: #60c9e2;
  }
  .btn {
    .el-button {
      padding: 6px 80px;
      background-color: #2c9fe0;
    }
  }
}
</style>

