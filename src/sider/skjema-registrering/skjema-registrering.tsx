import * as React from 'react';
import LastInnSisteStilling from './last-inn-siste-stilling';
import { endreSvarAction, resetSvarAction, SporsmalId, State as SvarState } from '../../ducks/svar';
import { hentSvar, Svar } from '../../ducks/svar-utils';
import { AppState } from '../../reducer';
import { connect, Dispatch } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { MatchProps } from '../../utils/utils';
import { RouteComponentProps } from 'react-router';
import Skjema from '../../komponenter/skjema/skjema';
import { OPPSUMMERING_PATH, SKJEMA_PATH } from '../../utils/konstanter';
import {
    defaultConfigForSporsmalsflyt,
    nullStillSporsmalSomIkkeSkalBesvares
} from '../../komponenter/skjema/skjema-utils';
import { RegistreringType } from '../../ducks/registreringstatus';
import hentRegistreringSporsmalene from './skjema-sporsmalene';
import { selectSisteStilling, Stilling, velgSisteStilling } from '../../ducks/siste-stilling';
import {
    resetStillingSporsmal
} from './sporsmal/sporsmal-siste-stilling/siste-stilling-utils';

interface DispatchProps {
    resetSvar: (sporsmalId: SporsmalId) => void;
    endreSvar: (sporsmalId: SporsmalId, svar: Svar) => void;
    velgStilling: (stilling: Stilling) => void;
}

interface StateProps {
    svarState: SvarState;
    sisteStilling: Stilling;
    defaultStilling: Stilling;
}

type Props = DispatchProps & StateProps & InjectedIntlProps & RouteComponentProps<MatchProps>;

class SkjemaRegistrering extends React.Component<Props> {
    render() {
        const {
            endreSvar,
            resetSvar,
            intl,
            svarState,
            sisteStilling,
            velgStilling,
            defaultStilling,
            location,
            match,
            history
        } = this.props;
        const sporsmalProps = {
            endreSvar: (sporsmalId, svar) => {

                resetStillingSporsmal(svarState, endreSvar, sisteStilling, defaultStilling, velgStilling);

                nullStillSporsmalSomIkkeSkalBesvares(sporsmalId, svar, endreSvar, resetSvar);

                endreSvar(sporsmalId, svar);
            },
            intl: intl,
            hentAvgittSvar: (sporsmalId: SporsmalId) => hentSvar(svarState, sporsmalId),
        };

        const regType = RegistreringType.ORDINAER_REGISTRERING;
        const registreringSporsmalElementene = hentRegistreringSporsmalene(sporsmalProps, regType);

        return (
            <LastInnSisteStilling>
                <Skjema
                    config={defaultConfigForSporsmalsflyt}
                    baseUrl={SKJEMA_PATH}
                    endUrl={OPPSUMMERING_PATH}
                    {...{location, match, history}}
                >
                    {
                        registreringSporsmalElementene
                    }
                </Skjema>
            </LastInnSisteStilling>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    svarState: state.svar,
    sisteStilling: selectSisteStilling(state),
    defaultStilling: state.defaultStilling.stilling,
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
    resetSvar: (sporsmalId) => dispatch(resetSvarAction(sporsmalId)),
    endreSvar: (sporsmalId, svar) => dispatch(endreSvarAction(sporsmalId, svar)),
    velgStilling: (stilling: Stilling) => dispatch(velgSisteStilling(stilling)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SkjemaRegistrering));