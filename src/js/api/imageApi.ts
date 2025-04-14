import axios from '@/js/http/axios_http';


export function GetImageSence() {
      return axios({
        method: 'get',
        url: '/image/getSceneList'
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