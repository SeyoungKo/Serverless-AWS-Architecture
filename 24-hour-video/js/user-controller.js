// Auth0 Signin, SignOut 버튼 제어

var userController = {
    data:{
        auth0Lock : null,
        config : null
    },
    uiElements:{
        loginButton: null,
        logoutButton: null,
        profileButton: null,
        profileNameLabel: null,
        profileImage: null
    },
    init: function(config){
        var that = this;

        this.uiElements.loginButton= $('#auth0-login');
        this.uiElements.logoutButton= $('#auth0-logout');
        this.uiElements.profileButton= $('#user-profile');
        this.uiElements.profileNameLabel = $('#profilename');
        this.uiElements.profileImage= $('#profilepicture');

        this.data.config = config;
        // Auth0 클라이언트 ID 및 도메인은 config.js 파일에서 설정된다.
        this.data.auth0Lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain);

        var idToken = localStorage.getItem('userToken');

        // 토큰이 있는 경우
        if(idToken){
            this.configureAuthenticatedRequests();
            this.data.auth0Lock.getProfile(idToken, function(err, data){ // 이미 토큰이 있는 경우 Auth0에서 프로필을 조회할 수 있다.
                if(err){
                    return alert('에러발생:'+ err.message);
                }
                that.showUserAuthenticationDetails(profile);
            });
        }

        this.wireEvents();
    },
    configureAuthenticatedRequests: function(){
        // 이 토큰은 이후의 모든 요청에서 HTTP 헤더 (Authorization)로 전송된다.
        $.ajaxSetup({
            'beforeSend': function(xhr){
                xhr.setRequestHeader('Authorization', 'Bearer' + localStorage.getItem('userToken'));
            }
        });
    },
    showUserAuthenticationDetails: function(profile){
        var showAuthenticationElements = !!profile;

        if(showAuthenticationElements){
            this.uiElements.profileNameLabel.text(profile.nickname);
            this.uiElements.profileImage.attr('src', profile.picture);
        }
        this.uiElements.loginButton.toggle(!showAuthenticationElements);
        this.uiElements.logoutButton.toggle(showAuthenticationElements);
        this.uiElements.profileButton.toggle(showAuthenticationElements);
    },

    wireEvents:function(){
        var that = this;

        this.uiElements.loginButton.click(function(e){
            var params = {
                authParams:{
                    scope:'openid email user_metadata picture'
                }
            };

            // auth0Lock은 대화상자를 표시하고 사용자가 등록하고 로그인할 수 있도록 한다.
            that.data.auth0Lock.show(params,function(err, profile, token){
                    if(err){
                        alert('에러발생');
                    }else{
                        localStorage.setItem('userToken', token); // JWT 토큰을 로컬에 저장한다.
                        that.configureAuthenticatedRequests();
                        that.showUserAuthenticationDetails(profile);
                    }
             });
         });
         // Logout이 클릭되면 로컬저장소에서 사용자의 토큰이 제거되고 Login 버튼이 표시되며 profile, Logout버튼이 숨겨진다.
         this.uiElements.logoutButton.click(function(e){
             localStorage.removeItem('userToken');
             that.uiElements.logoutButton.hide();
             that.uiElements.profileButton.hide();
             that.uiElements.loginButton.show();
         });
     }
}