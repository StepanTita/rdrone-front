<template>
  <div class="alert">
    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
    <strong>Status: </strong> {{ text }}
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    text: String
  }
}
</script>

<style scoped>
/* The alert message box */
.alert {
  /* *SIZES* */
  width: 70%;

  /* *MARGINS-PADDINGS* */
  margin-top: 25px;
  padding: 20px;

  /* *POSITION* */
  position: fixed; /* Sit on top of the page content */
  left: 15%;
  right: 15%;
  z-index: 2;

  /* *TRANSFORMS* */
  opacity: 0;
  transition: 0.5s;

  /* *FONTS* */
  color: white;
  font-family: Verdana,sans-serif;
  font-size: 15px;
}

.success, .warning, .critical, .info {
  opacity: 0.83;
}

.success {
  background-color: #04AA6D;

}

.warning {
  background-color: #ff9800;
}

.info {
  background-color: #2196F3;
}

.critical {
  background-color: #f44336;
}

/* The close button */
.closebtn {
  margin-left: 15px;

  float: right;

  cursor: pointer;
  transition: 0.3s;

  color: white;
  font-weight: bold;
  font-size: 22px;
  line-height: 20px;
}

/* When moving the mouse over the close button */
.closebtn:hover {
  color: black;
}
</style>