import { CSSProperties } from 'astro/types';

interface ElementConfig {
  selector: string;
  styles: CSSProperties;
}

interface LayoutConfig {
  'power-button': ElementConfig;
  knobs: ElementConfig[];
  'level-lights': ElementConfig[];
  'display-section': ElementConfig;
  'control-buttons': Array<ElementConfig & { ledStyles?: CSSProperties }>;
  'row-indicator-leds': ElementConfig[];
}

const echoplexLayoutConfig: LayoutConfig = {
  "power-button": {
    selector: "#power-button",
    styles: {
      right: "2%",
      top: "40%",
      width: "2.14%",
      height: "37.04%",
      pointerEvents: "auto", // Use camelCase for JS style properties
      zIndex: "1000",
    },
  },
  knobs: [
    {
      selector: "[data-param="input"]",
      styles: {
        left: "1.3%",
        top: "56%",
        width: "2.8%",
        height: "22.5%",
      },
    },
    {
      selector: "[data-param="output"]",
      styles: {
        left: "7.5%",
        top: "56%",
        width: "2.8%",
        height: "22.5%",
      },
    },
    {
      selector: "[data-param="mix"]",
      styles: {
        left: "21.2%",
        top: "56%",
        width: "2.8%",
        height: "22.5%",
      },
    },
    {
      selector: "[data-param="feedback"]",
      styles: {
        left: "26.95%",
        top: "56%",
        width: "2.8%",
        height: "22.5%",
      },
    },
  ],
  "level-lights": [
    {
      selector: "#input-level",
      styles: {
        position: "absolute",
        left: "13.15%",
        top: "73%",
        width: "6.421875px",
        height: "6.609375px",
      },
    },
    {
      selector: "#feedback-level",
      styles: {
        position: "absolute",
        left: "17.05%",
        top: "73%",
        width: "6.421875px",
        height: "6.609375px",
      },
    },
  ],
  "display-section": {
    selector: ".display-section",
    styles: {
      left: "32.8%",
      top: "32%",
      width: "16.9%",
      height: "27%",
    },
  },
  "control-buttons": [
    {
      selector: "[data-function="parameters"]",
      styles: {
        left: "54.3%",
        top: "9.0%",
        width: "2.6%",
        height: "21.0%",
      },
    },
    {
      selector: "[data-function="record"]",
      styles: {
        left: "61%",
        top: "10.3%",
        width: "2.6%",
        height: "21%",
      },
      ledStyles: {
        position: "absolute",
        left: "46.5%",
        top: "36.125px",
        width: "6.90625px",
        height: "5.34375px",
      },
    },
    {
      selector: "[data-function="overdub"]",
      styles: {
        left: "65.5%",
        top: "10.3%",
        width: "2.6%",
        height: "21%",
      },
      ledStyles: {
        position: "absolute",
        left: "46.5%",
        top: "36.125px",
        width: "6.90625px",
        height: "5.34375px",
      },
    },
    {
      selector: "[data-function="multiply"]",
      styles: {
        left: "70%",
        top: "10.3%",
        width: "2.6%",
        height: "21%",
      },
      ledStyles: {
        position: "absolute",
        left: "46.5%",
        top: "36.125px",
        width: "6.90625px",
        height: "5.34375px",
      },
    },
    {
      selector: "[data-function="insert"]",
      styles: {
        left: "74.5%",
        top: "10.3%",
        width: "2.6%",
        height: "21%",
      },
      ledStyles: {
        position: "absolute",
        left: "46.5%",
        top: "36.125px",
        width: "6.90625px",
        height: "5.34375px",
      },
    },
    {
      selector: "[data-function="mute"]",
      styles: {
        left: "79.2%",
        top: "10.3%",
        width: "2.6%",
        height: "21%",
      },
      ledStyles: {
        position: "absolute",
        left: "46.5%",
        top: "36.125px",
        width: "6.90625px",
        height: "5.34375px",
      },
    },
    {
      selector: "[data-function="undo"]",
      styles: {
        left: "83.6%",
        top: "10.3%",
        width: "2.6%",
        height: "21%",
      },
      ledStyles: {
        position: "absolute",
        left: "46.5%",
        top: "36.125px",
        width: "6.90625px",
        height: "5.34375px",
      },
    },
    {
      selector: "[data-function="nextloop"]",
      styles: {
        left: "88.3%",
        top: "10.3%",
        width: "2.6%",
        height: "21%",
      },
      ledStyles: {
        position: "absolute",
        left: "46.5%",
        top: "36.125px",
        width: "6.90625px",
        height: "5.34375px",
      },
    },
  ],
  "row-indicator-leds": [
    {
      selector: "#loops-led",
      styles: {
        position: "absolute",
        left: "56.5%",
        top: "52%",
        width: "0.7%",
        height: "6%",
      },
    },
    {
      selector: "#midi-led",
      styles: {
        position: "absolute",
        left: "57.7%",
        top: "62.5%",
        width: "0.7%",
        height: "6%",
      },
    },
    {
      selector: "#switches-led",
      styles: {
        position: "absolute",
        left: "58.8%",
        top: "72%",
        width: "0.7%",
        height: "6%",
      },
    },
    {
      selector: "#timing-led",
      styles: {
        position: "absolute",
        left: "60.0%",
        top: "82%",
        width: "0.7%",
        height: "6%",
      },
    },
  ],
};

export default echoplexLayoutConfig;
