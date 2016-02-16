package fr.jean.sara.components;

import org.apache.tapestry5.EventConstants;
import org.apache.tapestry5.annotations.Events;
import org.apache.tapestry5.annotations.MixinAfter;
import org.apache.tapestry5.corelib.mixins.Autocomplete;

@Events(EventConstants.PROVIDE_COMPLETIONS)
@MixinAfter
public class SaraAutoComplete extends Autocomplete {

}
