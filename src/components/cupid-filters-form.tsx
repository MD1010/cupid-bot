import { useEffect, useReducer, useRef } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { storage } from "@/storage";
import { STORAGE_KEYS } from "@/consts";
import type { CupidFilters } from "@/types";

// Define action types for reducer
type ActionType =
  | { type: "SET_MESSAGE"; payload: string }
  | { type: "SET_ONLY_ACCEPT_IF_INCLUDE_WORDS"; payload: string }
  | { type: "SET_FILTER_IF_HAS_WORDS"; payload: string }
  | { type: "SET_IS_NOT_SEMITRAILER"; payload: boolean }
  | { type: "SET_IS_SMOKING"; payload: boolean }
  | { type: "SET_IS_WEED"; payload: boolean }
  | { type: "SET_IS_RELIGIOUS"; payload: boolean }
  | { type: "SET_MAX_DISTANCE"; payload: number }
  | { type: "SET_HEIGHT_RANGE"; payload: [number, number] };

// Initial state for reducer
const initialState = {
  messageToSend: "",
  onlyAcceptIfIncludeWords: "",
  filterIfHasWords: "",
  isNotSemitrailer: false,
  isSmoking: false,
  isWeed: false,
  isReligious: false,
  maxDistance: 0,
  heightRange: [140, 200],
};

// Reducer function
const reducer = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case "SET_MESSAGE":
      return { ...state, messageToSend: action.payload };
    case "SET_ONLY_ACCEPT_IF_INCLUDE_WORDS":
      return { ...state, onlyAcceptIfIncludeWords: action.payload };
    case "SET_FILTER_IF_HAS_WORDS":
      return { ...state, filterIfHasWords: action.payload };
    case "SET_IS_NOT_SEMITRAILER":
      return { ...state, isNotSemitrailer: action.payload };
    case "SET_IS_SMOKING":
      return { ...state, isSmoking: action.payload };
    case "SET_IS_WEED":
      return { ...state, isWeed: action.payload };
    case "SET_IS_RELIGIOUS":
      return { ...state, isReligious: action.payload };
    case "SET_MAX_DISTANCE":
      return { ...state, maxDistance: action.payload };
    case "SET_HEIGHT_RANGE":
      return { ...state, heightRange: action.payload };
    default:
      return state;
  }
};

export const FiltersForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const maxDistanceSliderRef = useRef();

  useEffect(() => {
    const loadFiltersFromStorage = async () => {
      try {
        const filtersObject = (await storage.getItem(STORAGE_KEYS.filters)) as {
          messageToSend: string;
          filters: CupidFilters;
        };

        if (filtersObject) {
          dispatch({
            type: "SET_MESSAGE",
            payload: filtersObject.messageToSend || "",
          });
          dispatch({
            type: "SET_ONLY_ACCEPT_IF_INCLUDE_WORDS",
            payload:
              filtersObject.filters.onlyAcceptIfIncludeWords?.join(",") || "",
          });
          dispatch({
            type: "SET_FILTER_IF_HAS_WORDS",
            payload: filtersObject.filters.filterIfHasWords?.join(",") || "",
          });
          dispatch({
            type: "SET_IS_NOT_SEMITRAILER",
            payload: filtersObject.filters.isNotSemitrailer || false,
          });
          dispatch({
            type: "SET_IS_SMOKING",
            payload: filtersObject.filters.isSmoking || false,
          });
          dispatch({
            type: "SET_IS_WEED",
            payload: filtersObject.filters.isWeed || false,
          });
          dispatch({
            type: "SET_IS_RELIGIOUS",
            payload: filtersObject.filters.isReligious || false,
          });
          dispatch({
            type: "SET_MAX_DISTANCE",
            payload: filtersObject.filters.maxDistance || 0,
          });
          dispatch({
            type: "SET_HEIGHT_RANGE",
            payload: [
              filtersObject.filters.heightRange.from || 140,
              filtersObject.filters.heightRange.to || 200,
            ],
          });
        }
      } catch (error) {
        console.error("Error loading filters from storage:", error);
      }
    };
    loadFiltersFromStorage();
  }, []);

  const handleSubmit = async () => {
    const filtersObject: { messageToSend: string; filters: CupidFilters } = {
      messageToSend: state.messageToSend,
      filters: {
        isNotSemitrailer: state.isNotSemitrailer,
        isSmoking: state.isSmoking,
        isWeed: state.isWeed,
        isReligious: state.isReligious,
        maxDistance: state.maxDistance,
        heightRange: { from: state.heightRange[0], to: state.heightRange[1] },
      },
    };

    // Trim and split onlyAcceptIfIncludeWords if it has a value
    if (state.onlyAcceptIfIncludeWords.trim() !== "") {
      filtersObject.filters.onlyAcceptIfIncludeWords =
        state.onlyAcceptIfIncludeWords
          .split(",")
          .map((word: string) => word.trim());
    }

    // Trim and split filterIfHasWords if it has a value
    if (state.filterIfHasWords.trim() !== "") {
      filtersObject.filters.filterIfHasWords = state.filterIfHasWords
        .split(",")
        .map((word: string) => word.trim());
    }

    try {
      await storage.setItem(STORAGE_KEYS.filters, filtersObject);
      window.close();
      console.log("Filters saved to storage:", filtersObject);
    } catch (error) {
      console.error("Error saving filters to storage:", error);
    }
  };

  return (
    <div className="flex flex-col gap-5 text-lg text-primary p-6 font-bold w-full h-full">
      <h1 className="text-lg text-center">Narrow your search</h1>

      <div>
        <Label>Your Message</Label>
        <Textarea
          value={state.messageToSend}
          onChange={(e) =>
            dispatch({ type: "SET_MESSAGE", payload: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Must include words separated by comma</Label>
        <Textarea
          value={state.onlyAcceptIfIncludeWords}
          onChange={(e) =>
            dispatch({
              type: "SET_ONLY_ACCEPT_IF_INCLUDE_WORDS",
              payload: e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label>Should not include words separated by comma</Label>
        <Textarea
          value={state.filterIfHasWords}
          onChange={(e) =>
            dispatch({
              type: "SET_FILTER_IF_HAS_WORDS",
              payload: e.target.value,
            })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Not semitrailer</Label>
        <Switch
          checked={state.isNotSemitrailer}
          onCheckedChange={(checked) =>
            dispatch({ type: "SET_IS_NOT_SEMITRAILER", payload: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Not Smoking</Label>
        <Switch
          checked={state.isSmoking}
          onCheckedChange={(checked) =>
            dispatch({ type: "SET_IS_SMOKING", payload: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Not Weed</Label>
        <Switch
          checked={state.isWeed}
          onCheckedChange={(checked) =>
            dispatch({ type: "SET_IS_WEED", payload: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Religious</Label>
        <Switch
          checked={state.isReligious}
          onCheckedChange={(checked) =>
            dispatch({ type: "SET_IS_RELIGIOUS", payload: checked })
          }
        />
      </div>

      <div className="flex flex-col justify-between gap-5">
        <div className="flex justify-between">
          <Label>Max Distance</Label>
          <span className="font-semibold text-sm">{state.maxDistance} km</span>
        </div>
        <Slider
          ref={maxDistanceSliderRef}
          defaultValue={[state.maxDistance]}
          step={5}
          max={100}
          onValueChange={(val) =>
            dispatch({ type: "SET_MAX_DISTANCE", payload: val[0] })
          }
        />
      </div>

      <div className="flex flex-col justify-between gap-5 py-6">
        <div className="flex justify-between">
          <Label>Height Range</Label>
          <span className="font-semibold text-sm">
            Between {state.heightRange[0]}cm and {state.heightRange[1]}cm
          </span>
        </div>

        <Slider
          defaultValue={state.heightRange}
          min={140}
          step={1}
          max={185}
          onValueChange={(val) =>
            dispatch({
              type: "SET_HEIGHT_RANGE",
              payload: val as [number, number],
            })
          }
        />
      </div>

      <Button className="rounded-md" onClick={handleSubmit}>
        Apply Filters
      </Button>
    </div>
  );
};
