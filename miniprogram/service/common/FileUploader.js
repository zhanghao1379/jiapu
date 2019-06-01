const uuid=require("uuid");
function FileUploader() {}

/**
 * 上传文件近照
 * @param {String} 要上传文件的云路径
 * @param {String} 本地近照路径
 * @return {String} 云文件Id
 */
FileUploader.prototype.uploadRecentPhoto = function(photo) {

  return new Promise(function(ok, fail) {
    // 将图片上传至云存储空间
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: 'recent-photo/' + uuid(),
      // 指定要上传的文件的小程序临时文件路径
      filePath: photo,
      // 成功回调
      success: res => {
        console.log('上传近照成功');
        ok(res.fileID);
      },
      fail: err => {
        console.err.log(err);
        fail(err);
      }
    });
  });

};

module.exports = FileUploader;