import * as React from 'react';
import { loadProvider } from '../utils';
import { convertToCurve } from '../curve';
import { Curve } from '@zapjs/curve/lib/src';

interface State {
  error: string;
  success: string;
  curves: Array<number[]>;
  emptyCurve: any;
  loading: boolean;
}

export class CurveInit extends React.PureComponent<{web3: any; address: string}, State> {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      success: null,
      curves: [],
      loading: false,
      emptyCurve: this.getEmptyCurve(),
    };
    this.handleAddCurve = this.handleAddCurve.bind(this);
    this.handleChangeCurve = this.handleChangeCurve.bind(this);
  }


  getEmptyCurve(end = 1) {
    return {
      end: end,
      curve: '',
    }
  }

  async handleSubmit(e) {
    const {web3, address} = this.props;
    const {curves} = this.state;
    e.preventDefault();
    const endpoint = e.target.endpoint.value;
    this.setState({loading: true});
    try {
      const curve: Curve = new Curve(curves.reduce((all, curve) => all.concat(curve), []));
      const provider = await loadProvider(web3, address);
      await provider.initiateProviderCurve({ endpoint, term: curve.values });
      this.setState({
        error: null,
        emptyCurve: this.getEmptyCurve(),
        curves: [],
        success: 'Created endpoint ' + endpoint
      });
      e.target.reset();
      this.setState({loading: false});
    } catch (e) {
      this.setState({
        success: null,
        error: e.message
      });
      this.setState({loading: false});
    }
  }

  handleAddCurve() {
    const { curves, emptyCurve } = this.state;
    try {
      const newCurve = convertToCurve(Number(emptyCurve.end), emptyCurve.curve);
      this.setState({
        curves: [...curves, newCurve],
        emptyCurve: this.getEmptyCurve(newCurve[newCurve.length - 1]),
      });
    } catch (e) {
      console.log(e);
      this.setState({
        error: e.message
      });
    }
  }

  handleChangeCurve(e) {
    const {id, value} = e.target;
    this.setState({
      emptyCurve: {...this.state.emptyCurve, [id]: value}
    });
  }

  render() {
    const {success, error, curves, emptyCurve, loading} = this.state;
    return (
      <form className={loading ? 'disabled' : undefined} onSubmit={e => {this.handleSubmit(e)}}>
        {success && <div className="message message-success">{success}</div>}
        {error && <div className="message message-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="endpoint">Endpoint</label>
          <input type="text" id="endpoint" name="endpoint" required/>
        </div>
        {curves.map((curve, index) =>
          <CurveFormGroupDisabled key={JSON.stringify(curve) + index} curve={curve} prevCurve={curves[index - 1]} />
        )}
        <CurveFormGroup
          prevCurve={curves[curves.length - 1]}
          curve={emptyCurve}
          handleChangeCurve={this.handleChangeCurve}
          handleAddCurve={this.handleAddCurve} />
        <div className="form-group">
          <button type="submit">Create curve</button>
        </div>
      </form>
    );
  }
}

const CurveFormGroupDisabled = ({curve, prevCurve}) => (
  <fieldset disabled>
    <div className="form-group">
      <label>Curve starting at {prevCurve ? prevCurve[prevCurve.length - 1] : 1} to</label>
      <input type="number" defaultValue={curve[curve.length - 1]} />
    </div>
    <div className="form-group">
      <label>Curve</label>
      <input type="text" defaultValue={curve.slice(1, curve.length - 1)} />
    </div>
  </fieldset>
);

const CurveFormGroup = ({curve, prevCurve, handleChangeCurve, handleAddCurve}) => (
  <fieldset>
    <div className="form-group">
      <label htmlFor="end">Curve starting at {prevCurve ? prevCurve[prevCurve.length - 1] : 1} to</label>
      <input type="number" onChange={handleChangeCurve} id="end" value={curve.end} />
    </div>
    <div className="form-group">
      <label htmlFor="curve">Curve</label>
      <input type="text" id="curve" onChange={handleChangeCurve} value={curve.curve} />
    </div>
    <div className="form-group"><button onClick={handleAddCurve} type="button">Add curve</button></div>
  </fieldset>
);