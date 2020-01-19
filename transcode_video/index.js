'use strict';

var AWS = require('aws-sdk');

var elasticTranscoder = new AWS.elasticTranscoder({
    region:'us-east-1'
});

exports.handler = function(event, context, callback){
    var key = event.Records[0].s3.object.key;

    var sourceKey = decodeURIComponent(key.replace(/\+/g," "));  // 버킷 객체를 식별하는 키를 디코딩

    var outputKey = sourceKey.split('.')[0];

    console.log('key:', key,source,outputKey);

    var params = {
        PipelineId : '1578938992571-sn1wx3',  // pipelineId를 기입한다.
        OutputKeyPrefix : outputKey + '/',
        Input:{
            Key:sourceKey
        },
        Outputs:[
            {
                Key:outputKey + '-1080p'+ '.mp4',
                presetId: '1351620000001-000001' // 일반 1080p Elastic Transcoder 사전 설정
            },
            {
                Key:outputKey + '-720p' + '.mp4',
                presetId:'1351620000001-000001'
            },
            {
                Key:outputKey + '-web-720p' + '.mp4',
                presetId : '1351620000001-100070' // 웹에 적합한 720p Elastic Transcoder 사전 설정
            }
        ]};

        elasticTranscoder.createJob(params,function(error,data){

            if(error){  // Elastic Transcoder에서 작업을 만들지 못하면 콜백함수로 오류를 기록한다.
                callback(error);
         }
    });
}