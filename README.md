# Wetube clone coding

## 환경 설정

### WSL(Windows Subsystem for Linux)

VM(가상머신)을 실행하며 발생하는 복잡한 설정 없이 윈도우 운영체제에서 리눅스를 사용할 수 있게 해줌.

2023/01/17 기준: `wsl --install` 명령어 사용. Ubuntu-20.04 알아서 설치됨.

(참고: [https://learn.microsoft.com/ko-kr/windows/wsl/,](https://learn.microsoft.com/ko-kr/windows/wsl/) [https://m.hanbit.co.kr/channel/category/category_view.html?cms_code=CMS8729537531](https://m.hanbit.co.kr/channel/category/category_view.html?cms_code=CMS8729537531))

### zsh + oh my zsh 설치

(참고: [https://frenchline.tistory.com/18](https://frenchline.tistory.com/18))

### chocolately

windows용 패키지 매니저. powershell에서 커맨드를 통해 원하는 패키지를 설치 및 관리할 수 있음.

### Node.js

javascript가 브라우저에서만 사용되던 것에서 벗어나 그 외의 환경에서도 사용할 수 있게 한 플랫폼.

### npm(Node package manager)

자바스크립트 프로그래밍 언어를 위한 패키지 관리자. Node.js 설치하면 바로 사용 가능(같이 설치됨). package.json 파일에 정보들이 명시됨.

### Express

Node web frameworks의 기본 라이브러리. NodeJS를 사용한 웹서버를 구현하게 해주는 프레임워크.

(참고: [https://developer.mozilla.org/ko/docs/Learn/Server-side/Express_Nodejs/Introduction](https://developer.mozilla.org/ko/docs/Learn/Server-side/Express_Nodejs/Introduction))

### Babel

최신 버전의 javascript를 사용할 수 있게 해주는 컴파일러. NodeJS에서 모든 버전의 javascript가 실행되지 않는데, Babel이 변환시켜준다.

### Nodemon

디렉토리의 파일 변경이 감지되면 자동으로 노드 응용 프로그램을 다시 시작하여 Node.js 기반 응용 프로그램을 개발하는 데 도움이 되는 모듈. Node monitoring이라고 생각하면 됨.

(참고: [https://www.npmjs.com/package/nodemon](https://www.npmjs.com/package/nodemon))

### morgan

HTTP request 로그 관리를 위한 NodeJS의 middleware (https://github.com/expressjs/morgan)

### Pug

template engine (https://github.com/pugjs/pug, [https://pugjs.org/api/getting-started.html](https://pugjs.org/api/getting-started.html))

### MongoDB

NoSQL로 분류되는 도큐먼트 지향 데이터베이스 시스템. JSON 형태의 스키마 사용(BSON).

### Mongoose

MongoDB의 ODM(Object Document Mapping, 객체 모델링 도구), 조회한 데이터를 javascript 객체로 바꿔줌.

([https://mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html))

### bcrypt

password hashing 해주는 라이브러리. (https://github.com/kelektiv/node.bcrypt.js)

### connect-mongo

session 정보를 MongoDB에 저장해서 서버가 재시작해도 정보를 유지할 수 있게 해줌. ([https://www.npmjs.com/package/connect-mongo](https://www.npmjs.com/package/connect-mongo))

### multer

파일 업로드를 위해 사용되는 multipart/form-data를 다루기 위한 node.js 의 미들웨어. multipart(multipart/form-data)가 아닌 form을 처리하지 않음.([https://www.npmjs.com/package/multer](https://www.npmjs.com/package/multer))

### Webpack

모던 JavaScript 애플리케이션을 위한 정적 모듈 번들러.

모듈 번들러: 웹 애플리케이션을 구성하는 자원(HTML, CSS, Javscript, Images 등)을 모두 각각의 모듈로 보고 이를 조합해서 병합된 하나의 결과물을 만드는 도구.

실무에서는 Webpack을 직접 사용하기보다는 Webpack이 포함된 툴(react, vue 및 기타 프레임워크)을 사용함. 거의 업계 표준임.

Webpack은 new JS → old JS로 변환시켜주는 것이 아니라 이렇게 코드를 변환시켜줄 loader를 실행하는 것. 백엔드에 babel이 있다면 프론트엔드엔 Webpack이 있다.

([https://webpack.js.org/](https://webpack.js.org/))

쉬운 대체제로는 gulp이 있으나 webpack보다 유용하지는 않음. ([https://gulpjs.com/](https://gulpjs.com/))

---

## Express

-   route ([https://expressjs.com/ko/guide/routing.html](https://expressjs.com/ko/guide/routing.html))
    1. get: GET request에 응답하는 라우트 메소드
    2. use: middleware를 모든 global 영역으로(request에서 호출) 사용하도록 해준다. express는 코드를 위에서 아래로 읽기 때문에 app.get()보다 위에 두어야 한다.
-   middleware ([https://expressjs.com/ko/guide/writing-middleware.html](https://expressjs.com/ko/guide/writing-middleware.html))
    1. request와 response 사이의 software
    2. 모든 middleware 는 handler(controller)
    3. (req, res, next) 3개의 argument를 갖는다3. .
-   router ([https://expressjs.com/ko/4x/api.html#router](https://expressjs.com/ko/4x/api.html#router))

    1. 라우터 Object는 미들웨어 및 라우트와 분리된 인스턴스이다. (컨트롤러와 url의 관리를 쉽게 해줌)
    2. 모든 Express 애플리케이션은 앱 라우터가 내장되어 있다.
    3. 라우터는 미들웨어 자체처럼 동작하므로, app.use()나 다른 라우터의 use()의 argument로 3. 사용할 수 있다.

-   router와 controller를 한 파일에 작성하는 것은 좋지 않다.
    → 각각 파일로 분리 (라우터에서 컨트롤러를 사용함. 라우터에서 컨트롤러를 사용함. 독립적으로 효율적인 관리를 위해 쓰임별로 구분해주기)
-   export / import 할 때

```jsx
export default globalRouter;
	-> import globalRoute(or 다른 이름도 가능) from "./rounters/globalRouter"
	-> 오직 한 개만 내보낼 수 있음
export const edit = (req, res) => {};
	-> import { edit, watch }(꼭 지정된 이름만 가능) from "../controllers/videoController";
	-> 여러 개 내보낼 수 있음
```

-   app.use(express.urlencoded())
    서버로 POST 요청을 할 때 form에서 보낸 데이터를 파싱하기 위한 express 미들웨어 사용. router보다 앞에 작성해야 한다.

-   한 번 render() 한 후 또 render()나 sendStatus()처럼 response를 보내려고 하면 에러 발행

```jsx
Video.find({}, (error, videos) => {
    res.render("home", { pageTitle: "Home", videos });
    res.sendStatus(200);  // 에러 발생

		=> return res.render("home", { pageTitle: "Home", videos });  // 호출 후 함수 종료
});
```

![error_cannot_set_headers_after_they_are_sent_to_the_client.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/038d144f-5834-4a58-b356-e38bdc26168e/error_cannot_set_headers_after_they_are_sent_to_the_client.png)

그래서 res.render() 앞에 return이 꼭 필요한 것은 아니지만 클라이언트에 응답 후 함수를 종료해서 실수를 방지하기 위해 붙여준다.

-   res.locals
    미들웨어에서 res.locals.xx 로 변수 선언을 하면 해당 미들웨어를 거친 view(xx.pug)에서 사용할 수 있다.

---

## Pug

### Template Structure

🔽 server.js

특정url에 미들웨어나 함수를 특정한다. 기본url은 “/”이다. app.use()와 비슷.

➡ xxRouter.js

xxRouter = express.get()으로 새로운 Router 객체 생성하고, xxRouter.get(url, controller의 함수명)으로 수행할 컨트롤러를 특정한다.

➡ xxController.js

xxController = (req, res) ⇒ res.render(화면 렌더링할 pug파일, { 전달할 변수명: 값 })

➡ xx.pug

화면 렌더링을 한다. extend base.pug는 기본틀같은 파일. 모든 페이지에 똑같이 적용되는 footer.pug가 include 되어있음. 템플릿 안에서 섹션을 만들려면 block을 만든다. block에 넣고 싶은 내용은 각 페이지 pug에서 ‘block 변수명’으로 채운다. xxController에서 받은 변수는 #{ 변수명 }에 채워진다.

-   partials
    1. html 조각, 단순 복사/붙여넣기를 대체한다.
    2. 데이터를 받을 수 없음.
-   mixins
    1. data를 받을 수 있는 partials.
    2. 적용하기: mixins 폴더 생성 → 반복하고 싶은 aa(mixin명)을 포함한 xx.pug 생성 → 불러오고 싶은 yy.pug에서 include mixins/xx.pug → +aa(받아올 2. 요소)

---

## Mongoose

-   middleware

    1. 비동기 함수가 실행되는 동안 제어가 전달되는 함수(pre 또는 post hook이라고도 함). Express의 Morgan 같은 것.
    2. Model이 생성되기 전에 선언해야 한다. (참고: [https://mongoosejs.com/docs/middleware.html](https://mongoosejs.com/docs/middleware.html))
    3. pre / post save() hook은 update()나 findOneAndUpdate()에서 실행되지 않음 ⇒ static으로 처리 가능([https://mongoosejs.com/docs/api/schema.html#Schema.prototype.static()](<https://mongoosejs.com/docs/api/schema.html#Schema.prototype.static()>)3. )

-   특별한 이유가 없으면 xxxRemove() 대신 xxxDelete()를 사용하자!
-   populate()를 통해 다른 컬렉션의 문서를 참조할 수 있다.

---

## Webpack

-   여러 loader를 한 번에 사용할 수 있다. webpack은 뒤에서부터 읽는다.
    ```jsx
    // webpack.config.js
    module.exports = {
        ...
        output: {
            filename: "main.js",
            path: path.resolve(__dirname, "assets", "js"),
        },
        module: {
            rules: [
                ...
                {
                    test: /\.scss$/,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
            ],
        },
    };
    ```
    1. sass-loader: .scss 파일을 브라우저가 이해할 수 있는 .css로 변환
    2. css-loader: @import, url()등 최신 css 코드를 브라우저가 이해할 수 있는 코드로 변환
    3. style-loader: 위에서 변환한 css코드를 DOM 내부에 적용
    4. 변환된 코드는 output에 설정된 파일에 저장됨
    5. 그 js를
    ```jsx
    // base.pug
    script(*src*="/static/js/main.js")
    ```
    를 통해 view에 적용

---

## Cookie & Session

-   cookie는 브라우저에 있으며 session ID를 포함한다. session ID는 백엔드에 있다. DB에 저장하지 않으면 서버가 재시작할 때마다 세션 정보들은 사라진다.
-   동작 순서
    클라이언트(브라우저)에서 서버에 요청 → 서버가 쿠키 생성 → 응답에 쿠키를 포함해서 줌 → 브라우저에서 쿠키 저장해놓고 서버에 요청할 때마다 함께 보냄 → 서버에서는 이 쿠키로 클라이언트를 구분할 수 있음
-   cookie 옵션
    1. Domain: 쿠키가 어디서 왔는지 어디로 가야하는지 알려줌. 브라우저는 domain에 따라 쿠키를 저장함.
    2. Expires: 쿠키 만료날짜. 만료 날짜를 지정하지 않으면 session cookie가 되고, 브라우저에서 프로그램을 닫거나 PC를 끄면 쿠키도 사라짐.
    3. Max-Age: 쿠키를 얼마동안 유지할 것 인지(밀리세컨드). 브라우저는 몇십년 켜두더라도 이 기간이 끝나면 쿠키가 만료되어 사라짐.
    4. secret: 쿠키가 Domain에서 만든 것인지 증명하는데 쓰이는 문구

---

## Github Login - Authorizing OAuth Apps

-   OAuth를 사용하여 GitHub ID를 다른 애플리케이션에 연결할 수 있다.
-   Web application flow: 먼저 Wetube를 OAuth App에 등록한다. ([https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps](https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps))
    1. 사용자의 Github ID 요청
        1. allow_signup: OAuth flow 중에 github 계정을 새로 만들수 있게 할거지 여부.
        2. scope: 유저에게서 얼마나 많은 정보를 읽고 가져올 것인가. “ “(공백)으로 구분됨.
    2. GitHub가 임시 code와 함께 사용자를 사이트로 다시 리디렉션한다. 이 code을 access token으로 교환한다.
    3. 앱이 사용자의 액세스 토큰을 사용하여 API에 액세스합니다3. .
-   Github REST API를 사용하면 사용자에 대한 공개 및 비공개 정보를 얻을 수 있다. ([https://docs.github.com/ko/rest/users/users?apiVersion=2022-11-28](https://docs.github.com/ko/rest/users/users?apiVersion=2022-11-28))

---

## TIL(Today I Learned)

### package.json 파일에서

```json
"dependencies": {},  // 프로젝트를 실행하기 위한 모듈
"devDependencies": {}  // 개발자한테 필요한 모듈
```

```json
"scripts": {
    "dev": "nodemon --exec babel-node index.js"
},
```

console에서 npm run dev를 해서 실행하는 스크립트. nodemon을 실행해서 파일 변경을 감시하고, babel로 컴파일해서 node가 이해하지 못하는 javascript는 변환하라는 의미.

### Data Attributes(데이터 속성)

특정 데이터를 DOM요소에 저장해두기 위해 사용. front-end에서 ‘data-’로 시작하는 속성에 원하는 데이터를 유저한테 보이지 않고 저장할 수 있다. [api view](https://www.notion.so/0531364fea0747a08610bd913d60e7ad?pvs=21)에서 사용함.

(https://developer.mozilla.org/ko/docs/Learn/HTML/Howto/Use_data_attributes)

### MediaDevices

카메라, 마이크 등 현재 연결된 미디어 입력 장치로의 접근 방법을 제공하는 인터페이스.(https://developer.mozilla.org/ko/docs/Web/API/MediaDevices)

### MediaRecorder

MediaStream Recording API를 제공하여 쉽게 녹화, 녹음을 할 수 있게 해주는 인터페이스.(https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

### FFmpeg

오디오 및 비디오를 기록, 변환 및 스트리밍하는 크로스 플랫폼 솔루션.

ffmpeg.wasm: ffmpeg(c언어로 작성됨)를 브라우저에서 사용할 수 있게 해줌.

(https://ffmpeg.org/, https://www.npmjs.com/package/@ffmpeg/ffmpeg)

### WebAssembly

개방형 표준. 프론트엔드에서 매우 빠른 코드를 실행할 수 있게 해줌.

### Express-flash

Express 애플리케이션용 플래시 메시지. 플래시는 플래시 메시지를 정의하고 요청을 리디렉션하지 않고 렌더링할 수 있는 기능이 있는 connect-flash의 확장입니다. session 기반으로 한 유저에게만 보여진다.

(https://www.npmjs.com/package/express-flash)

---

[부가 설명](https://www.notion.so/0531364fea0747a08610bd913d60e7ad)

[에러 발생 및 해결](https://www.notion.so/af790e79f6c1489c811a27ccb779573e)

[동작 명령](https://www.notion.so/aa3cdc03be1f460da6263cdadcf85c74)
