import Server from './server';
class API extends Server {
    async getThemeList(params = {}) {
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/getThemeList', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '获得主题列表失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/getThemeList',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }
    }

    async getTypeList(params = {}) {
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/getTypeList', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '获得分类列表失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/getTypeList',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async getViewCount(params = {}) {
        try {
            let result = await this.axios('get', 'http://39.108.56.116:3000/count', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '获取访问量失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/count',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async getThemeCount(params = {}) {
        try {
            let result = await this.axios('get', 'http://39.108.56.116:3000/themeCount', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '获取主题数量失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/themeCount',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async getViewMost(params = {}) {
        try {
            let result = await this.axios('get', 'http://39.108.56.116:3000/viewMost', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '获取查看最多的主题列表失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/viewMost',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async getCommentMost(params = {}) {
        try {
            let result = await this.axios('get', 'http://39.108.56.116:3000/commentMost', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '获取评论最多的主题列表失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/commentMost',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async getIconSrc(params = {}) {
        try {
            let result = await this.axios('get', 'http://39.108.56.116:3000/iconSrc', params);
            if (result && result.status === 1) {
                console.log('getIconSrc:', result);
                return result;
            } else {
                let err = {
                    tip: '获取头像Src失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/iconSrc',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async getValidImg(params = {}) {
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/loginImg', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '获取验证码Src失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/loginImg',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async login(params = {}) {
        try {
            console.log('参数：', params);
            let result = await this.axios('post', 'http://39.108.56.116:3000/login', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '登陆失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/login',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async loginout(params = {}) {
        try {
            console.log('参数：', params);
            let result = await this.axios('get', 'http://39.108.56.116:3000/loginout', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '登出失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/loginout',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async getLoginStatus(params = {}) {
        try {
            console.log('参数：', params);
            let result = await this.axios('get', 'http://39.108.56.116:3000/loginstatus', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '获取登陆状态失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/loginstatus',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async getTheme(params = {}) {
        try {
            let result = await this.axios('get', 'http://39.108.56.116:3000/theme/' + params._id, params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '抓取theme失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/theme/' + params._id,
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }
    async addType(params = {}) {
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/addnewtype', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '新增分类失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/theme/addnewtype',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }
    async addNewTheme(params = {}) {
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/newtheme', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '新建文章失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/theme/newtheme',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }
    async deleTheme(params = {}) {
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/theme/'+params._id+'/delete', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '删除文章失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/theme/'+params._id+'/delete',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }
    async editTheme(params = {}) {
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/theme/'+params._id+'/edit', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '修改文章失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/theme/'+params._id+'/edit',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }
    async secretTheme(params = {}) {
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/theme/'+params._id+'/addsecret', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '隐藏文章失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/theme/'+params._id+'/addsecret',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }
    async unsecretTheme(params = {}) {
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/theme/'+params._id+'/delesecret', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '取消隐藏文章失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/theme/'+params._id+'/delesecret',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }
    async addReply(params = {}) {
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/theme/'+params._id+'/reply', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '评论失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/theme/'+params._id+'/reply',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async optReply(params = {}) {//对评论赞或者踩
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/reply/'+params._id+'/replyopt', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '操作失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/reply/'+params._id+'/replyopt',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }

    async search(params = {}) {//搜索
        try {
            let result = await this.axios('post', 'http://39.108.56.116:3000/search', params);
            if (result && result.status === 1) {
                return result;
            } else {
                let err = {
                    tip: '搜索失败',
                    response: result,
                    data: params,
                    url: 'http://39.108.56.116:3000/search',
                }
                throw err;
            }
        } catch (err) {
            throw err;
        }

    }
}

export default new API();
