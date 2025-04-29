import axios from '@/js/http/axios_http';


export function GetImageSence(pagination:any) {
      return axios({
        method: 'post',
        url: '/image/getSceneList',
        data: pagination,
        headers: { 'content-type': 'application/json' },
      });
  }
  
export function GetImageList(id:string){

  return axios({
    method: 'post',
    url: '/image/getImage/'+id
  });
}

export function GetSceneContent(id:string){

  return axios({
    method: 'post',
    url: '/image/getScene/'+id
  });
}

export function GetSceneTagList(){
  return axios({
    method: 'get',
    url: '/image/getSceneTagList'
  });
}

export function DeleteSceneTag(ids:Array<Number>){
  return axios({
    method: 'post',
    url: '/image/deleteSceneTag',
    data: ids,
    headers: { 'content-type': 'application/json' },
  });
}

export function AddSceneTag(tag:string){
  return axios({
    method: 'post',
    url: '/image/addSceneTag',
    data: tag,
    headers: { 'content-type': 'text/plain' },
  });
}

export function UpdateSceneTag(tag:any){
  return axios({
    method: 'post',
    url: '/image/updateSceneTag',
    headers: { 'content-type': 'application/json' },
    data: tag,
  });
}

export function UpdateScene(formData:any){
  return axios({
    method: 'post',
    url: '/image/updateScene',
    headers: { 'content-type': 'application/json' },
    data: formData,
  });
}