import shallow from 'zustand/shallow';
import {
  KPGMold,
  useLabelStore,
  labelSelector,
  PropertyValueType,
} from './App';
import { KeypointPropertiesInput } from './InsertKPGTool';
import { Collapse, InputNumber } from 'antd';
import './LabelDataDisplay.css';

interface IRenderKPGRowProps {
  kgbIdx: number;
}

function RenderKPGRow(props: IRenderKPGRowProps) {
  const pointList = useLabelStore(
    (state) => Object.keys(state.keypointGraphList[props.kgbIdx]),
    shallow
  );
  return (
    <>
      <span>{`Keypoint Graph #${props.kgbIdx}`}</span>
      <span>{`${pointList.length} points`}</span>
    </>
  );
}

function KeypointGraphList() {
  const { selectedKPG, setLabelState } = useLabelStore(labelSelector);
  const highlightRowStyle = {
    backgroundColor: '#ff7875',
    color: 'darkblue',
  };
  const kpgList = useLabelStore(
    (state) => Object.keys(state.keypointGraphList),
    shallow
  );
  return (
    <>
      {kpgList.map((kpgKey) => {
        const handleRowClick = (e: React.MouseEvent<HTMLDivElement>) => {
          setLabelState((state) => {
            state.selectedKPG = +kpgKey;
            state.selectedKP = undefined;
          });
        };
        return (
          <div
            className="ItemRow"
            style={selectedKPG === +kpgKey ? highlightRowStyle : {}}
            key={`${kpgKey}`}
            onClick={handleRowClick}
          >
            <RenderKPGRow kgbIdx={+kpgKey} />
          </div>
        );
      })}
    </>
  );
}

interface IPostionInputProps {
  x: number;
  y: number;
  onXChange: (val: number) => void;
  onYChange: (val: number) => void;
}

function PostionInput(props: IPostionInputProps) {
  function handleXChange(v: number | string | undefined) {
    if (v !== undefined) {
      props.onXChange(+v);
    }
  }
  function handleYChange(v: number | string | undefined) {
    if (v !== undefined) {
      props.onYChange(+v);
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ marginRight: '1em' }}>
        <span key={`inputx`}>x: </span>
        <InputNumber
          size="small"
          step={0.5}
          precision={4}
          value={props.x}
          onChange={handleXChange}
        />
      </div>
      <div>
        <span key={`inputy`}>y: </span>
        <InputNumber
          size="small"
          step={0.5}
          precision={4}
          value={props.y}
          onChange={handleYChange}
        />
      </div>
    </div>
  );
}

function KeypointGraphDetail() {
  const {
    keypointGraphList,
    selectedKPG,
    selectedKP,
    setLabelState,
  } = useLabelStore(labelSelector);
  const kpg = keypointGraphList[selectedKPG];
  function handleCollapseChange(panelKey: string | string[]) {
    let idx: number | undefined = undefined;
    if (panelKey !== undefined && typeof panelKey === typeof '') {
      idx = +panelKey;
    }
    setLabelState((state) => {
      state.selectedKP = idx;
    });
  }
  function handleXChange(newX: number) {
    if (selectedKP !== undefined) {
      setLabelState((state) => {
        state.keypointGraphList[selectedKPG][selectedKP].x = newX;
      });
    }
  }
  function handleYChange(newY: number) {
    if (selectedKP !== undefined) {
      setLabelState((state) => {
        state.keypointGraphList[selectedKPG][selectedKP].y = newY;
      });
    }
  }
  function handlePropsChange(propKey: string, newVal: PropertyValueType) {
    if (selectedKP !== undefined) {
      setLabelState((state) => {
        state.keypointGraphList[selectedKPG][selectedKP].properties[
          propKey
        ].value = newVal;
      });
    }
  }
  return (
    <Collapse
      onChange={handleCollapseChange}
      activeKey={'' + selectedKP}
      accordion
    >
      {kpg.map((kp, idx) => {
        return (
          <Collapse.Panel
            style={{ fontSize: 'small' }}
            header={`keypoint #${idx} - ${kp.name}`}
            key={idx}
          >
            <PostionInput
              x={kp.x}
              y={kp.y}
              onXChange={handleXChange}
              onYChange={handleYChange}
            />
            <KeypointPropertiesInput
              configProperties={KPGMold[idx].properties}
              valProperties={kp.properties}
              onChange={handlePropsChange}
            />
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
}

export function LabelDataDisplay() {
  return (
    <>
      Label Data
      <div key="KeypointGraphList" className="ItemList">
        <div>Item List:</div>
        <KeypointGraphList />
      </div>
      <div key="KeypointGraphDetail" className="ItemDetail">
        <div>Detail:</div>
        <KeypointGraphDetail />
      </div>
    </>
  );
}