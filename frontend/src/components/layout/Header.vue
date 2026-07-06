<template>
  <header class="header">
    <div class="left">
      <img src="../../assets/logo-kratos-white.png" />
    </div>

    <div class="center">
      <h1>Painel de Controle da Kratos Robotics</h1>
    </div>

    <div class="right"></div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1E3A5F;
  padding: 20px 32px;
  position: relative;
}

.left img {
  height: 100px;
}

.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

h1 {
  margin: 0;
  font-size: 35px;
  color: white;
}
</style>