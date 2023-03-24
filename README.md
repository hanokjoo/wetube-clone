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

[에러 발생 및 해결](https://www.notion.so/af790e79f6c1489c811a27ccb779573e)

---

## Mongoose

-   middleware
    1. 비동기 함수가 실행되는 동안 제어가 전달되는 함수(pre 또는 post hook이라고도 함). Express의 Morgan 같은 것.
    2. Model이 생성되기 전에 선언해야 한다. (참고: [https://mongoosejs.com/docs/middleware.html](https://mongoosejs.com/docs/middleware.html))
    3. pre / post save() hook은 update()나 findOneAndUpdate()에서 실행되지 않음 ⇒ static으로 처리 가능([https://mongoosejs.com/docs/api/schema.html#Schema.prototype.static()](<https://mongoosejs.com/docs/api/schema.html#Schema.prototype.static()>))
