import { annenStilling, ingenYrkesbakgrunn, Stilling } from '../../../../ducks/siste-stilling';
import { Data as OversettelseAvStillingData } from '../../../../ducks/oversettelse-av-stilling-fra-aareg';
import { DinSituasjonSvar, hentSvar, SisteStillingSvar } from '../../../../ducks/svar-utils';
import { SporsmalId } from '../../../../ducks/svar';

export const UTEN_STYRKKODE = 'utenstyrkkode';

export function hentOversattStillingFraAAReg(
    data: OversettelseAvStillingData,
): Stilling {
    const koderFraPam = data.konseptMedStyrk08List;
    let stilling: Stilling = annenStilling;
    if (koderFraPam.length > 0) {
        stilling = {
            label: koderFraPam[0].label,
            styrk08: koderFraPam[0].styrk08[0],
            konseptId: koderFraPam[0].konseptId === undefined ? -1 : koderFraPam[0].konseptId!,
        };
    }
    return stilling;
}

export function getDefaultSvar(
    sisteStilling: Stilling
): SisteStillingSvar {
    return sisteStilling === ingenYrkesbakgrunn
        ? SisteStillingSvar.HAR_IKKE_HATT_JOBB
        : SisteStillingSvar.HAR_HATT_JOBB;
}

export const situasjonerDerViVetAtBrukerenHarHattJobb: (DinSituasjonSvar | undefined)[] = [
    DinSituasjonSvar.MISTET_JOBBEN,
    DinSituasjonSvar.HAR_SAGT_OPP,
    DinSituasjonSvar.ER_PERMITTERT,
    DinSituasjonSvar.DELTIDSJOBB_VIL_MER,
    DinSituasjonSvar.VIL_BYTTE_JOBB,
    DinSituasjonSvar.ALDRI_HATT_JOBB,
    DinSituasjonSvar.VIL_FORTSETTE_I_JOBB,
];

export function skalSkjuleSvaralternativer(dinSituasjon: DinSituasjonSvar | undefined) {
    return situasjonerDerViVetAtBrukerenHarHattJobb.includes(dinSituasjon);
}

const _velgStillingHvisDenIkkeAlleredeErValgt = (stilling: Stilling, sisteStilling, velgStilling) => {
    if (sisteStilling.label !== stilling.label) {
        velgStilling(stilling);
    }
};

export const resetStillingSporsmal = (
    svarState,
    endreSvar,
    sisteStilling,
    defaultStilling,
    velgStilling
) => {

    const svar = hentSvar(svarState, SporsmalId.dinSituasjon) as DinSituasjonSvar;

    // Reset stilling
    if (svar === DinSituasjonSvar.ALDRI_HATT_JOBB) {
        velgStilling(ingenYrkesbakgrunn);
    } else {
        // TODO FO-1464 Skriv test for dette.
        if ((defaultStilling === ingenYrkesbakgrunn)
            && situasjonerDerViVetAtBrukerenHarHattJobb.includes(svar)) {
            _velgStillingHvisDenIkkeAlleredeErValgt(annenStilling, sisteStilling, velgStilling);
        }  else {
            _velgStillingHvisDenIkkeAlleredeErValgt(defaultStilling, sisteStilling, velgStilling);
        }
    }

    // Reset svar
    if (skalSkjuleSvaralternativer(svar)) {
        if (hentSvar(svarState, SporsmalId.sisteStilling) !== SisteStillingSvar.INGEN_SVAR) {
            endreSvar(SporsmalId.sisteStilling, SisteStillingSvar.INGEN_SVAR);
        }
    } else {
        endreSvar(
            SporsmalId.sisteStilling,
            getDefaultSvar(sisteStilling)
        );
    }
};