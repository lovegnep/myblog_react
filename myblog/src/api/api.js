import Server from './server';
class API extends Server{
  async getThemeList(params = {}){
    try{
      let result = await this.axios('post', 'http://39.108.56.116:3000/getThemeList', params); 
      if(result && result.status === 1){
        return result;
      }else{
        let err = {
          tip: '获得主题列表失败',
          response: result,
          data: params,
          url: 'http://39.108.56.116:3000/getThemeList',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }
  }

  async getTypeList(params = {}){
    try{
      let result = await this.axios('post', 'http://39.108.56.116:3000/getTypeList', params);
      if(result && result.status === 1){
        return result;
      }else{
        let err = {
          tip: '获得分类列表失败',
          response: result,
          data: params,
          url: 'http://39.108.56.116:3000/getTypeList',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }  

  }
  async getViewCount(params = {}){
    try{
      let result = await this.axios('get', 'http://39.108.56.116:3000/count', params);
      if(result && result.status === 1){
        return result;
      }else{
        let err = {
          tip: '获取访问量失败',
          response: result,
          data: params,
          url: 'http://39.108.56.116:3000/count',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }

  }
  async getThemeCount(params = {}){
    try{
      let result = await this.axios('get', 'http://39.108.56.116:3000/themeCount', params);
      if(result && result.status === 1){
        return result;
      }else{
        let err = {
          tip: '获取主题数量失败',
          response: result,
          data: params,
          url: 'http://39.108.56.116:3000/themeCount',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }

  }
  async getViewMost(params = {}){
    try{
      let result = await this.axios('get', 'http://39.108.56.116:3000/viewMost', params);
      if(result && result.status === 1){
        return result;
      }else{
        let err = {
          tip: '获取查看最多的主题列表失败',
          response: result,
          data: params,
          url: 'http://39.108.56.116:3000/viewMost',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }

  }
  async getCommentMost(params = {}){
    try{
      let result = await this.axios('get', 'http://39.108.56.116:3000/commentMost', params);
      if(result && result.status === 1){
        return result;
      }else{
        let err = {
          tip: '获取评论最多的主题列表失败',
          response: result,
          data: params,
          url: 'http://39.108.56.116:3000/commentMost',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }

  }
  async getIconSrc(params = {}){
    try{
      let result = await this.axios('get', 'http://39.108.56.116:3000/iconSrc', params);
      if(result && result.status === 1){
        console.log('getIconSrc:', result);
        return result;
      }else{
        let err = {
          tip: '获取头像Src失败',
          response: result,
          data: params,
          url: 'http://39.108.56.116:3000/iconSrc',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }

  }

  async getValidImg(params = {}){
    try{
      let result = await this.axios('post', 'http://39.108.56.116:3000/loginImg', params);
      if(result && result.status === 1){
        return result;
      }else{
        let err = {
          tip: '获取验证码Src失败',
          response: result,
          data: params,
          url: 'http://39.108.56.116:3000/loginImg',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }

  }
  async login(params = {}){
    try{
      console.log('参数：', params);
      let result = await this.axios('post', 'http://39.108.56.116:3000/login', params);
      if(result && result.status === 1){
        return result;
      }else{
        let err = {
          tip: '登陆失败',
          response: result,
          data: params,
          url: 'http://39.108.56.116:3000/login',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }

  }
}

export default new API();
