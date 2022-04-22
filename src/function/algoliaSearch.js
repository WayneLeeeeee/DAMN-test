import { debounce } from "lodash";
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

const algoliaClient = algoliasearch(
  // 不知道為什麼 process.env 沒有用....?
  //   process.env.ALGOLIA_SEARCH_APPLICATION_ID,
  //   process.env.ALGOLIA_SEARCH_ONLY_KEY
  "J7DTFHDUTR",
  //   "f21fb275a8c8418dea28825fc344be83"
  // 用上方的 API 只能搜尋，無法做其他的事，所以需要開一支新的
  "1361597443b85106e149185063d7a0ea"
);
const algoliaSearch = (index = "ingredients", value, userId) => {
  let algolia = algoliaClient.initIndex(index);
  if (!value) return "no value input";
  if (index === "fridge" || index === "historyIngredients") {
    algolia = algoliaClient.initIndex("users");
  }

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
    if (!userId) return;
    //
    algolia = algoliaClient.initIndex("users");
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
    // 取得使用者歷史紀錄資料
    let historyIngredients = [];
    const historyIngredientsDocsSnap = await getDocs(
      collection(db, `users/${userId}/historyIngredients`)
    );
    historyIngredientsDocsSnap.forEach((doc) => {
      historyIngredients.push({ objectID: doc.id, ...doc.data() });
    });

    user = {
      ...user,
      fridge: fridge,
      objectID: userId,
      historyIngredients: historyIngredients,
    };

    algolia.saveObject(user);
  };

  const fetchData = async function (value) {
    console.log("search...");
    // 如果是個人搜尋， 就針對 userId 去找
    const isPersonalSearch =
      index === "fridge" || index === "historyIngredients";
    // console.log(value);
    if (isPersonalSearch) {
      algolia.setSettings({
        attributesForFaceting: [
          "fridge", // or 'filterOnly(categories)' for filtering purposes only
          "historyIngredients", // or 'filterOnly(store)' for filtering purposes only
        ],
      });
    }
    try {
      const result = await algolia.search(value, {
        hitsPerPage: 10,
        //   https://www.algolia.com/doc/api-reference/api-parameters/filters/#examples
        filters: isPersonalSearch
          ? `objectID:${userId}`
          : "",
        //   analytics: true,
        similarQuery: value,
      });
      //console.log(result?.hits);
      return result?.hits;
    } catch (err) {
      console.log(err);
    }
  };

  flatCollection();
  const result = fetchData(value);
  //console.log(result);

  return result;
};

export { algoliaClient };
export default algoliaSearch;
