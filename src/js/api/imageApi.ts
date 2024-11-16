import axios from '@/js/http/axios_http';


export function GetImageSence() {
      return axios({
        method: 'get',
        url: '/image/getSceneList'
      });
  }
  