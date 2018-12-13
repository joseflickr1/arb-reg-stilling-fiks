import * as React from 'react';
import Alternativ from '../../../komponenter/skjema/alternativ';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { getIntlTekstForSporsmal, getTekstIdForSvar } from '../../../komponenter/skjema/skjema-utils';
import { Innholdstittel } from 'nav-frontend-typografi';
import { DinSituasjonSvar, Svar } from '../../../ducks/svar-utils';
import { SporsmalProps } from '../../../komponenter/skjema/sporsmal-utils';

type Props = SporsmalProps & InjectedIntlProps;

class SporsmalDinSituasjon extends React.Component<Props> {

    render() {
        const {endreSvar, hentAvgittSvar, sporsmalId, intl} = this.props;
        const fellesProps = {
            intl: intl,
            avgiSvar: (svar: DinSituasjonSvar) => {
                endreSvar(sporsmalId, svar);
            },
            getTekstId: (svar: Svar) => getTekstIdForSvar(sporsmalId, svar),
            hentAvgittSvar: () => hentAvgittSvar(sporsmalId),
        };

        return (
            <form className="spm-skjema">
                <fieldset className="skjema__fieldset">
                    <legend className="skjema__legend spm-hode">
                        <Innholdstittel tag="h1" className="spm-tittel">
                            {getIntlTekstForSporsmal(sporsmalId, 'tittel', intl, this.props.registeringType)}
                        </Innholdstittel>
                    </legend>
                    <div className="spm-body">
                        <Alternativ svar={DinSituasjonSvar.MISTET_JOBBEN} {...fellesProps}/>
                        <Alternativ svar={DinSituasjonSvar.HAR_SAGT_OPP} {...fellesProps}/>
                        <Alternativ svar={DinSituasjonSvar.DELTIDSJOBB_VIL_MER} {...fellesProps}/>
                        <Alternativ svar={DinSituasjonSvar.ALDRI_HATT_JOBB} {...fellesProps}/>
                        <Alternativ svar={DinSituasjonSvar.VIL_BYTTE_JOBB} {...fellesProps}/>
                        <Alternativ svar={DinSituasjonSvar.JOBB_OVER_2_AAR} {...fellesProps}/>
                        <Alternativ svar={DinSituasjonSvar.ER_PERMITTERT} {...fellesProps}/>
                        <Alternativ svar={DinSituasjonSvar.USIKKER_JOBBSITUASJON} {...fellesProps}/>
                        <Alternativ svar={DinSituasjonSvar.AKKURAT_FULLFORT_UTDANNING} {...fellesProps}/>
                        <Alternativ svar={DinSituasjonSvar.VIL_FORTSETTE_I_JOBB} {...fellesProps}/>
                    </div>
                </fieldset>
            </form>
        );
    }
}

export default injectIntl(SporsmalDinSituasjon);
