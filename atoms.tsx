/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
// Copyright 2024 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {atom} from 'jotai';
import {
  colors,
  defaultPromptParts,
  defaultPrompts,
  imageOptions,
} from './consts';
import {
  BoundingBox2DType,
  BoundingBox3DType,
  BoundingBoxMaskType,
  DetectTypes,
} from './Types';

export const ImageSrcAtom = atom<string | null>(imageOptions[0]);

export const ImageSentAtom = atom(false);

export const BoundingBoxes2DAtom = atom<BoundingBox2DType[]>([]);

export const PromptsAtom = atom<Record<DetectTypes, string[]>>({
  ...defaultPromptParts,
});
export const CustomPromptsAtom = atom<Record<DetectTypes, string>>({
  ...defaultPrompts,
});

export type PointingType = {
  point: {
    x: number;
    y: number;
  };
  label: string;
  confidence: number;
};

export const RevealOnHoverModeAtom = atom<boolean>(true);

export const FOVAtom = atom<number>(60);

export const BoundingBoxes3DAtom = atom<BoundingBox3DType[]>([]);

export const BoundingBoxMasksAtom = atom<BoundingBoxMaskType[]>([]);

export const PointsAtom = atom<PointingType[]>([]);

// export const PromptAtom = atom<string>("main objects");

export const TemperatureAtom = atom<number>(0.5);

export const ShareStream = atom<MediaStream | null>(null);

export const IsScreenshareAtom = atom(false);

export const DrawModeAtom = atom<boolean>(false);

export const DetectTypeAtom = atom<DetectTypes>('2D bounding boxes');

export const LinesAtom = atom<[[number, number][], string][]>([]);

export const JsonModeAtom = atom(false);

export const ActiveColorAtom = atom(colors[6]);

export const HoverEnteredAtom = atom(false);

export const HoveredBoxAtom = atom<number | null>(null);

export const VideoRefAtom = atom<{current: HTMLVideoElement | null}>({
  current: null,
});

export const InitFinishedAtom = atom(true);

export const BumpSessionAtom = atom(0);

export const IsUploadedImageAtom = atom(false);

export const IsLoadingAtom = atom(false);

// Filter state
export const ConfidenceThresholdAtom = atom<number>(0.5);
export const EnabledLabelsAtom = atom<Record<string, boolean>>({});

// Derived atoms for filtering
export const AllLabelsAtom = atom((get) => {
  const all = [
    ...get(BoundingBoxes2DAtom).map((i) => i.label),
    ...get(BoundingBoxes3DAtom).map((i) => i.label),
    ...get(BoundingBoxMasksAtom).map((i) => i.label),
    ...get(PointsAtom).map((i) => i.label),
  ];
  return [...new Set(all)].sort();
});

const filterItems = <T extends {confidence: number; label: string}>(
  items: T[],
  threshold: number,
  enabledLabels: Record<string, boolean>,
): T[] => {
  if (!items) return [];
  return items.filter(
    (item) =>
      item.confidence >= threshold && enabledLabels[item.label] !== false,
  );
};

export const FilteredBoundingBoxes2DAtom = atom((get) =>
  filterItems(
    get(BoundingBoxes2DAtom),
    get(ConfidenceThresholdAtom),
    get(EnabledLabelsAtom),
  ),
);
export const FilteredBoundingBoxes3DAtom = atom((get) =>
  filterItems(
    get(BoundingBoxes3DAtom),
    get(ConfidenceThresholdAtom),
    get(EnabledLabelsAtom),
  ),
);
export const FilteredBoundingBoxMasksAtom = atom((get) =>
  filterItems(
    get(BoundingBoxMasksAtom),
    get(ConfidenceThresholdAtom),
    get(EnabledLabelsAtom),
  ),
);
export const FilteredPointsAtom = atom((get) =>
  filterItems(
    get(PointsAtom),
    get(ConfidenceThresholdAtom),
    get(EnabledLabelsAtom),
  ),
);
