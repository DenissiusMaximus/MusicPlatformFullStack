import authEpics from "./auth";
import collectionEpics from "./collection";
import searchEpics from "./search";
import trackEpics from "./track";
import reviewEpics from "./review";
import {combineEpics} from "redux-observable";

const rootEpic = combineEpics(authEpics, collectionEpics, searchEpics, trackEpics, reviewEpics);

export default rootEpic;
