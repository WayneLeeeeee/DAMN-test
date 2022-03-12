import { debounce } from "lodash";
import { useState, useEffect } from "react";
import algoliasearch from "algoliasearch";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const client = algoliasearch(
  // 不知道為什麼 process.env 沒有用....?
  //   process.env.ALGOLIA_SEARCH_APPLICATION_ID,
  //   process.env.ALGOLIA_SEARCH_ONLY_KEY
  "J7DTFHDUTR",
  //   "f21fb275a8c8418dea28825fc344be83"
  // 用上方的 API 只能搜尋，無法做其他的事，所以需要開一支新的
  "1361597443b85106e149185063d7a0ea"
);

function useSearch(index = "ingredients", value, userId) {
  // 第一個 參數 只接受  ingredients, recipes, users 其中一項，沒寫預設就是 ingredients
  // 如果 index 是 fridge 需要第三個參數 userId
  // 第二個 參數 是查詢的字或詞
  // 第三個 參數 userId 是為了搜尋 冰箱食材 需要的
  let algolia = client.initIndex(index);

  if (index === "fridge") {
    algolia = client.initIndex("users");
  }

  const [result, setResult] = useState([]);
  //   const [data, setData] = useState([]);

  // 將 fireStore 舊的資料，移到 algolia
  // 如果是搜尋 冰箱 就把，collection 變成 objects in array
  const moveDataToAlgolia = async () => {
    // fetch all data from firestore
    const q = query(collection(db, index));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      data.push({ objectID: doc.id, ...doc.data() });
    });
    console.log("move data to algolia: ", data);
    algolia.saveObjects(data);
  };
  // 將 collection 扁平化
  const flatCollection = async () => {
    if (!userId && index !== "fridge") return;
    //
    algolia = client.initIndex("users");
    // 取得使用者資料
    let user = {};
    const userRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userRef);
    if (userDocSnap.exists()) {
      user = userDocSnap.data();
    } else {
      console.log("No such document!");
    }
    // 取得使用者冰箱資料
    let fridge = [];
    const fridgeDocsSnap = await getDocs(
      collection(db, `users/${userId}/fridge`)
    );
    fridgeDocsSnap.forEach((doc) => {
      // 整合 user 和 fridge
      fridge.push({ objectID: doc.id, ...doc.data() });
    });
    user = { ...user, fridge: fridge, objectID: userId };
    algolia.saveObject(user);
  };
  useEffect(() => {
    // 扁平化 collections
    flatCollection();

    // 只需執行一次(因為 Algolia 不會監聽之前在 fireStore 的資料)，之後 algolia 會監聽 fireStore 的新的變化(理論上是)
    // moveDataToAlgolia();
  }, []);

  // 每當 index 或是 value 有變動時，就重新 fetchData
  useEffect(() => {
    if (!value) return;
    // 為了避免過多的 request 設置 debounce (1200 毫秒) 減少無意義的 request
    const fetchData = debounce(async function (value) {
      console.log("search...");
      try {
        const result = await algolia.search(value, {
          hitsPerPage: 10,
          //   https://www.algolia.com/doc/api-reference/api-parameters/filters/#examples
          //   filters: "",
          //   analytics: true,
          similarQuery: value,
        });
        //   console.log(result?.hits);
        setResult(result?.hits);
      } catch (err) {
        // console.log(err);
        setResult(err);
      }
    }, 1200);

    fetchData(value);
  }, [index, value]);

  return result;
}

export { client };
export default useSearch;
