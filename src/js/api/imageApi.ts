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