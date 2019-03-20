var fileHost ="https://ttd-info.oss-ap-northeast-1.aliyuncs.com/";

var config = {
  uploadImageUrl: `${fileHost}`, // 默认存在根目录，可根据需求改
  AccessKeySecret: 'sxgyF4YowkdYcxCaTY0ICLJjVGXZuc',        // AccessKeySecret 去你的阿里云上控制台上找
  OSSAccessKeyId: 'LTAImfClYg7W74AX',         // AccessKeyId 去你的阿里云上控制台上找
  timeout: 80000 //这个是上传文件时Policy的失效时间
};
module.exports =config;