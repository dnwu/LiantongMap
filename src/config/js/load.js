export function download(data, name) {
  // 这里res.data是返回的blob对象
  var blob = new Blob([data], {
    type:
      // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
  });
  var downloadElement = document.createElement("a");
  // 创建下载的链接
  var href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  // 下载后文件名
  downloadElement.download = `${name}.xlsx`;
  document.body.appendChild(downloadElement);
  // 点击下载
  downloadElement.click();
  // 下载完成移除元素
  document.body.removeChild(downloadElement);
  // 释放掉blob对象
  window.URL.revokeObjectURL(href);
}

export function upload(param, type, axios) {
  var fileObj = param.file;
  var FileController = "/web-schedul/service/excel/upload/" + type;
  // FormData 对象
  var form = new FormData();
  // 文件对象
  form.append("file", fileObj);
  // 其他参数
  // form.append("xxx", xxx);
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  return new Promise((resolve, reject) => {
    axios.post(FileController, form, config).then(data => {
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}
