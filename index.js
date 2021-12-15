// // Move the mouse across the screen as a sine wave.
// var robot = require('robotjs')

// // Speed up the mouse.
// robot.setMouseDelay(2)

// var twoPI = Math.PI * 2.0
// var screenSize = robot.getScreenSize()
// var height = screenSize.height / 2 - 10
// var width = screenSize.width

// for (var x = 0; x < width; x++) {
//   y = height * Math.sin((twoPI * x) / width) + height
//   robot.moveMouse(x, y)
// }
// //

// for (const item of list) {
//   isOk = _item.find(_item=>item.id === _item.id)

// }

// 传入剩余金额和剩余人数 生成一个随机红包
function getAmount(amount, num) {
  const min = 10 * 100
  const max = 1000 * 100
  // 当数量大于min 比例缩小至min个人
  if (num > min) {
    amount = parseInt(amount / (num / min))
    num = min
  }
  let _amount = 0
  let arr = [] // 随机生成红包合集
  // 计算人均红包平均值
  let ave = parseInt(amount / num)
  for (let i = 0; i < num; i++) {
    let s = random(min, max)
    _amount += s
    arr.push(s)
  }
  let _arr = []
  // 真实金额差值大于0 说明需要往下修正金额
  while (_amount - amount > 0) {
    // 打乱arr 再取第一个红包往下递减
    let arr0 = randSort(arr)[0]
    // 当当前金额大于平均金额的时候随机减少
    if (arr0 - 1 > ave) {
      // 有时候ave~=30 不到30
      let amount_random = random(0, arr0 - ave) // 生成随机金额
      if (_amount - amount < amount_random) {
        amount_random = _amount - amount
      }
      arr.splice(0, 1, (arr0 -= amount_random))
      _amount -= amount_random
    } else {
      // 当当前金额小于评价金额的时候每次往下减1
      if (arr0 > min) {
        arr.splice(0, 1, (arr0 -= 1))
        _amount -= 1
      }
    }
  }
  // 生成随机区间数
  function random(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10)
  }
  // 生成随机排列数组
  function randSort(arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      var rand = parseInt(Math.random() * len)
      var temp = arr[rand]
      arr[rand] = arr[i]
      arr[i] = temp
    }
    return arr
  }
  return randSort(arr)[0]
}

let num = 100 // 人数
let amount = 100000 * 100 // 总金额
for (let i = num; i >= 0; i--) {
  let res = getAmount(amount, num)
  console.log(`---------->日志输出:res`, res)
  amount -= res
}
