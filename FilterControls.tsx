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

import {useAtom} from 'jotai';
import {useEffect} from 'react';
import {
  AllLabelsAtom,
  ConfidenceThresholdAtom,
  EnabledLabelsAtom,
} from './atoms';

export function FilterControls() {
  const [allLabels] = useAtom(AllLabelsAtom);
  const [threshold, setThreshold] = useAtom(ConfidenceThresholdAtom);
  const [enabledLabels, setEnabledLabels] = useAtom(EnabledLabelsAtom);

  useEffect(() => {
    if (allLabels.length > 0) {
      const newEnabledLabels = {...enabledLabels};
      let changed = false;
      for (const label of allLabels) {
        if (!(label in newEnabledLabels)) {
          newEnabledLabels[label] = true;
          changed = true;
        }
      }
      if (changed) {
        setEnabledLabels(newEnabledLabels);
      }
    }
  }, [allLabels, enabledLabels, setEnabledLabels]);

  if (allLabels.length === 0) {
    return null;
  }

  const toggleLabel = (label: string) => {
    setEnabledLabels((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="flex flex-col gap-3 border-l ml-4 pl-4 flex-shrink-0 w-64">
      <div className="uppercase">Filter results</div>

      {/* Confidence Threshold */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="confidence-slider"
          className="flex justify-between text-sm">
          <span>Confidence</span>
          <span>{Math.round(threshold * 100)}%</span>
        </label>
        <input
          id="confidence-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
      </div>

      {/* Label Filters */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-48">
        <div className="uppercase text-sm">Labels</div>
        {allLabels.map((label) => (
          <label
            key={label}
            className="flex items-center gap-2 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={enabledLabels[label] ?? true}
              onChange={() => toggleLabel(label)}
            />
            <span className="truncate" title={label}>
              {label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
