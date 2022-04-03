export const initialState = {
  user: null,
  newRecipeData: {
    name: "",
    rating: 2,
    likes: 0,
    serving: 1,
    ingredientsInfo: [],
    ingredientTags: [],
    steps: [],
  },
  navbarBtnId: 0,

  isUpdated: false,
  isUpdated2: false,

  isAssistantModelOpen: false,

  AIResponse: "",
  textFromMic: "",

  checkedList: [],

  ingredient: {
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    notes: "",
    endDate: "",
    isFrozen: false,
    imageURL: "",
  },
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_NEWRECIPEDATA: "SET_NEWRECIPEDATA",
  SET_BOTTOMNAVBARID: "SET_BOTTOMNAVBARID",
  SET_ISUPDATED: "SET_ISUPDATED",
  SET_ISUPDATED2: "SET_ISUPDATED2",
  SET_UPDATE_RECIPE_DATA: "SET_UPDATE_RECIPE_DATA",
  SET_CHECKEDLIST: "SET_CHECKEDLIST",
  SET_IS_ASSISTANT_MODEL_OPEN: "SET_IS_ASSISTANT_MODEL_OPEN",
  SET_AI_RESPONSE: "SET_AI_RESPONSE",
  SET_TEXT_FROM_MIC: "SET_TEXT_FROM_MIC",
  SET_INGREDIENT: "SET_INGREDIENT",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_NEWRECIPEDATA:
      return {
        ...state,
        newRecipeData: action.newRecipeData,
      };
    case actionTypes.SET_BOTTOMNAVBARID:
      return {
        ...state,
        navbarBtnId: action.navbarBtnId,
      };
    case actionTypes.SET_ISUPDATED:
      return {
        ...state,
        isUpdated: action.isUpdated,
      };
    case actionTypes.SET_ISUPDATED2:
      return {
        ...state,
        isUpdated2: action.isUpdated2,
      };
    case actionTypes.SET_CHECKEDLIST:
      return {
        ...state,
        checkedList: action.checkedList,
      };
    case actionTypes.SET_IS_ASSISTANT_MODEL_OPEN:
      return {
        ...state,
        isAssistantModelOpen: action.isAssistantModelOpen,
      };
    case actionTypes.SET_AI_RESPONSE:
      return {
        ...state,
        AIResponse: action.AIResponse,
      };
    case actionTypes.SET_TEXT_FROM_MIC:
      return {
        ...state,
        textFromMic: action.textFromMic,
      };
    case actionTypes.SET_INGREDIENT:
      return {
        ...state,
        ingredient: action.ingredient,
      };

    default:
      return state;
  }
};

export default reducer;
