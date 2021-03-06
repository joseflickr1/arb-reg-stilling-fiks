import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import Banner from './komponenter/banner/banner';
import ProgressBarContainer from './komponenter/progress-bar/progress-bar-container';
import Sideanimasjon from './komponenter/sideanimasjon/sideanimasjon';
import Inngangssporsmal from './sider/skjema-sykefravaer/inngangssporsmal';
import AlleredeRegistrert from './sider/allerede-registrert/allerede-registrert';
import {
    ALLEREDE_REGISTRERT_PATH,
    DU_ER_NA_REGISTRERT_PATH,
    FULLFOR_PATH,
    IKKE_ARBEIDSSSOKER_UTENFOR_OPPFOLGING_PATH, INFOSIDE_PATH,
    INNGANGSSPORSMAL_PATH,
    OPPSUMMERING_PATH,
    REAKTIVERING_PATH,
    SKJEMA_PATH,
    SKJEMA_SYKEFRAVAER_PATH,
    START_PATH
} from './utils/konstanter';
import Startside from './sider/start/startside';
import Infoside from './sider/infoside/infoside';
import KreverReaktivering from './sider/krever-reaktivering/krever-reaktivering';
import SkjemaRegistrering from './sider/skjema-registrering/skjema-registrering';
import SkjemaSykefravaerNyArbeidsgiver from './sider/skjema-sykefravaer/skjema-sykefravaer-ny-arbeidsgiver';
import SkjemaSykefravaerSammeArbeidsgiver from './sider/skjema-sykefravaer/skjema-sykefravaer-samme-arbeidsgiver';
import SkjemaSykefravaerSammeArbeidsgiverNyStilling
    from './sider/skjema-sykefravaer/skjema-sykefravaer-samme-arbeidsgiver-ny-stilling';
import SkjemaSykefravaerUsikker from './sider/skjema-sykefravaer/skjema-sykefravaer-usikker';
import Oppsummering from './sider/oppsummering/oppsummering';
import Fullfor from './sider/fullfor/fullfor';
import DuErNaRegistrert from './sider/registrert/registrert';
import { AppState } from './reducer';
import { connect } from 'react-redux';
import {
    Data as RegistreringstatusData,
    RegistreringType,
    selectRegistreringstatus
} from './ducks/registreringstatus';
import InfoForIkkeArbeidssokerUtenOppfolging
    from './sider/info-for-ikke-arbeidssoker-uten-oppfolging/info-for-ikke-arbeidssoker-uten-oppfolging';
import RedirectAll from './komponenter/redirect-all';
import { selectReaktiveringStatus } from './ducks/reaktiverbruker';
import { STATUS } from './ducks/api-utils';
import { erKlarForFullforing } from './sider/fullfor/fullfor-utils';
import { selectFeatureToggles, Data as FeatureToggleData } from './ducks/feature-toggles';
import TjenesteOppdateres from './sider/tjeneste-oppdateres';

interface StateProps {
    registreringstatusData: RegistreringstatusData;
    reaktivertStatus: string;
    featureToggles: FeatureToggleData;
    state: AppState;
}

class Routes extends React.Component<StateProps> {

    render() {

        const { registreringstatusData, reaktivertStatus, featureToggles } = this.props;
        const erNede = featureToggles['arbeidssokerregistrering.nedetid'];

        const registreringType = registreringstatusData.registreringType;

        if (registreringType === RegistreringType.ALLEREDE_REGISTRERT) {
            return <RedirectAll to={ALLEREDE_REGISTRERT_PATH} component={AlleredeRegistrert}/>;
        } else if (registreringType === RegistreringType.SPERRET) {
            return (
                <RedirectAll
                    to={IKKE_ARBEIDSSSOKER_UTENFOR_OPPFOLGING_PATH}
                    component={InfoForIkkeArbeidssokerUtenOppfolging}
                />
            );
        } else if (registreringType === RegistreringType.REAKTIVERING &&
            reaktivertStatus !== STATUS.OK) {
            if (erNede) {
                return <RedirectAll to={'/'} component={TjenesteOppdateres}/>;
            }
            return <RedirectAll to={REAKTIVERING_PATH} component={KreverReaktivering} />;
        }

        const visSykefravaerSkjema = registreringType === RegistreringType.SYKMELDT_REGISTRERING;
        const visOrdinaerSkjema = !visSykefravaerSkjema;
        const klarForFullforing = erKlarForFullforing(this.props.state);

        return (
            <>
                <Route path="/" component={Banner}/>
                <Route path="/:url" component={ProgressBarContainer}/>

                <Sideanimasjon>

                    <Switch>

                        {erNede ? <RedirectAll to={'/'} component={TjenesteOppdateres}/> : null}
                        {klarForFullforing ? <Route path={OPPSUMMERING_PATH} component={Oppsummering} /> : null}
                        {(klarForFullforing || reaktivertStatus === STATUS.OK) ? <Route path={DU_ER_NA_REGISTRERT_PATH} component={DuErNaRegistrert} /> : null} {/*tslint:disable-line*/}

                        { visOrdinaerSkjema ? (
                            <Switch>
                                <Route
                                    path={START_PATH}
                                    component={Startside}
                                />
                                <Route
                                    path={`${SKJEMA_PATH}/:id`}
                                    component={SkjemaRegistrering}
                                />
                                {klarForFullforing ?
                                    <Route path={FULLFOR_PATH} component={Fullfor} />
                                    :
                                    null
                                }
                                <Redirect
                                    to={START_PATH}
                                />
                            </Switch>
                        ) : null }

                        { visSykefravaerSkjema ? (
                            <Switch>
                                <Route
                                    path={INNGANGSSPORSMAL_PATH}
                                    component={Inngangssporsmal}
                                />
                                {klarForFullforing ?
                                    <Route path={INFOSIDE_PATH} component={Infoside} />
                                    :
                                    null
                                }
                                <Route
                                    path={`${SKJEMA_SYKEFRAVAER_PATH}/1/:id`}
                                    component={SkjemaSykefravaerSammeArbeidsgiver}
                                />
                                <Route
                                    path={`${SKJEMA_SYKEFRAVAER_PATH}/2/:id`}
                                    component={SkjemaSykefravaerSammeArbeidsgiverNyStilling}
                                />
                                <Route
                                    path={`${SKJEMA_SYKEFRAVAER_PATH}/3/:id`}
                                    component={SkjemaSykefravaerNyArbeidsgiver}
                                />
                                <Route
                                    path={`${SKJEMA_SYKEFRAVAER_PATH}/4/:id`}
                                    component={SkjemaSykefravaerUsikker}
                                />
                                <Redirect
                                    to={INNGANGSSPORSMAL_PATH}
                                />
                            </Switch>
                        ) : null }

                    </Switch>

                </Sideanimasjon>
            </>);
    }

}

const mapStateToProps = (state: AppState) => ({
    registreringstatusData: selectRegistreringstatus(state).data,
    reaktivertStatus: selectReaktiveringStatus(state),
    featureToggles: selectFeatureToggles(state),
    state: state,
});

export default connect(mapStateToProps, null, null, { pure: false })(Routes);
