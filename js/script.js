const todoValue = document.getElementById("js-todo-ttl"); //入力欄を取得
const todoRegister = document.getElementById("js-register-btn"); //登録するボタン取得
const todoDelete = document.getElementById("js-del-btn");//削除ボタンのid取得
const todoList = document.getElementById("js-todo-list"); //未完リストのul取得
const doneList = document.getElementById("js-done-list"); //完了リストのul取得
let listItems = []; //todoのオブジェクト const itemを pushするための空配列
const storage = localStorage;


//登録ボタンをクリックでイベント発火、第二引数にDOM操作をする処理をまとめた関数を入れる
todoRegister.addEventListener('click', () => {
    const todo = document.createTextNode(todoValue.value); //入力データを取得 createTextNodeでvalueを文字列に変換
    const litag = document.createElement('li'); //liタグを作る準備 
    const ptag = document.createElement('p'); //pタグを作る準備

    if (todoValue.value !== '') {  //todovalueが空じゃなければtrue。以下実行する
        const registeredValue = listItems.find(
            (item) => item.todoValue == todoValue.value
        );

        if (registeredValue === undefined) { //同じ内容のtodoが登録されていないかチェックする
            const item = { //itemでtodo一つ一つのオブジェクトを作成
                todoValue: todoValue.value, //入力されたtodoのvalue
                isDone: false, //完了したかどうかの判断に使う
                isDeleted: false //削除したかどうかの判断に使う
            };
            listItems.push(item); //itemオブジェクトをlistItemsの配列にpush
            storage.store = JSON.stringify(listItems); //listItemsをjsonデータに書き換えてlocalStorageにstoreキーで保存する

            todoValue.value = ''; // フォームを初期状態（空）にする

            //ul>li>p構造を作る
            ptag.appendChild(todo); //pタグの子要素に登録データを挿入  親要素から作っていくとエラーになるので子要素から親要素に向かって作っていく
            litag.appendChild(ptag); //liタグの子要素にpタグを挿入
            todoList.appendChild(litag); //ulタグの子要素にliタグを挿入

            //ボタンを入れるdiv要素追加
            const btn_box = document.createElement('div'); //divタグの準備 完了削除ボタンをまとめるためにdivタグを用意
            btn_box.setAttribute('class', 'btn-box'); //class名の指定
            litag.appendChild(btn_box); //liタグの子要素に挿入

            //完了ボタン追加
            const donebtn = document.createElement('button');  //buttonをcreateする関数をdonebtnにセット
            donebtn.setAttribute('id', 'js-done-btn'); //id属性にjsdonebtnを追加
            donebtn.innerHTML = '完了'; //innerHTMLに完了を入れる
            btn_box.appendChild(donebtn); //li.appendChildからbtn_box.appendChildに変更

            //削除ボタン追加
            const delbtn = document.createElement('button');//完了ボタンと同じ要領
            delbtn.setAttribute('id', 'js-del-btn');
            delbtn.innerHTML = '削除';
            btn_box.appendChild(delbtn); //li.appendChildからbtn_box.appendChildに変更

            //削除機能追加
            delbtn.addEventListener('click', () => {
                deleteTodo(delbtn);
            });
            //完了機能追加
            donebtn.addEventListener('click', () => {
                doneTodo(donebtn);
            });

        } else { //重複した場合アラートが出るよう設定
            alert(
                "タスクが重複しているため登録できません。別の名前で登録してください。"
            );
        }
    }
});


const deleteTodo = (delbtn) => { //引数に削除ボタンを指定する（空欄だと４行目でエラーが出る）
    const delconfirm = this.confirm('本当に削除しますか？'); //誤って削除するのを防ぐ最終確認
    if (delconfirm === true) { //もし最終確認でOKが押されたら
        const choseTodo = delbtn.closest('li'); //押された削除ボタンから見て1番近いliタグを取得
        //削除が押されたアイテムがToDoリスト内かDoneリスト内かで処理を変える条件分岐
        if (choseTodo.classList.contains('done-item')) { //liタグにdone-itemクラスがあれば
            doneList.removeChild(choseTodo); //doneListの中の該当liタグを削除（右側Doneリスト内で削除を行う）
        } else { //条件に一致しない場合は
            todoList.removeChild(choseTodo); //todoListの中の該当liタグを削除（左側ToDoリスト内で削除を行う）
        }
        //以下削除状態を保存、リロードしても出てこないようにする
        const delbtnDiv = delbtn.closest("div"); //①
        const delTodoTxt = delbtnDiv.previousElementSibling; //②
        const delValue = listItems.find( //③
            (item) => item.todoValue === delTodoTxt.textContent
        );
        delValue.isDeleted = true; //④
        const newlistItems = listItems.filter((item) => item.isDeleted === false); //⑤
        listItems = newlistItems; //⑥
        storage.store = JSON.stringify(listItems); //⑦
    }
};

const doneTodo = (donebtn) => {
    const doneTodo = donebtn.closest('li'); //完了ボタンから1番近いliタグを取得
    doneTodo.setAttribute('class', 'done-item'); //条件分岐のための準備
    doneList.appendChild(doneTodo); //Doneリストの子要素に取得したliタグを挿入

    const donebtnDiv = donebtn.closest("div"); //完了ボタンから一番近いdivを取得
    const doneTodoTxt = donebtnDiv.previousElementSibling; //取得したdv要素の一個前の要素を取得
    const doneValue = listItems.find( //文字列が一致するオブジェクトを探して定数に入れる
        (item) => item.todoValue === doneTodoTxt.textContent
    );
    doneValue.isDone = true; //取得したオブジェクトデータをtrueに変更する
    storage.store = JSON.stringify(listItems); //ローカルストレージに保存
    donebtn.remove(); //完了ボタンを削除
};

document.addEventListener("DOMContentLoaded", () => { //DOMが読み込まれたときに実行
    const json = storage.store; //localStorageからjson
    if (json === undefined) { //jsonが定義されてなければこの処理を終了させる
        return;
    }
    listItems = JSON.parse(json); //jsonをオブジェクト配列に変換

    for (const item of listItems) { //listItemsの中を繰り返し処理定数itemに入れる
        const todo = document.createTextNode(item.todoValue);
        const litag = document.createElement("li");
        const ptag = document.createElement("p");

        //ul>li>p構造を作る
        ptag.appendChild(todo);
        litag.appendChild(ptag);

        if (item.isDone === false) {
            todoList.appendChild(litag);
        } else {
            doneList.appendChild(litag);
            litag.setAttribute("class", "done-item");
        }

        //ボタンを入れるdiv要素追加
        const btn_box = document.createElement("div");
        btn_box.setAttribute("class", "btn-box");
        litag.appendChild(btn_box);

        if (item.isDone === false) {
            //完了ボタン追加
            const donebtn = document.createElement("button");
            donebtn.setAttribute("id", "js-done-btn");
            donebtn.innerHTML = "完了";
            btn_box.appendChild(donebtn);
            //完了機能追加
            donebtn.addEventListener("click", () => {
                doneTodo(donebtn);
            });
        }

        //削除ボタン追加
        const delbtn = document.createElement("button");
        delbtn.setAttribute("id", "js-del-btn");
        delbtn.innerHTML = "削除";
        btn_box.appendChild(delbtn);

        //削除機能追加
        delbtn.addEventListener("click", () => {
            deleteTodo(delbtn);
        });
    }
});

