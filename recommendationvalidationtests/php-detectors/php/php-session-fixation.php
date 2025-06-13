<?php

namespace Foo;
// ruleid: php-session-fixation
$foo->loadFromExtension('security', ['session_fixation_strategy' => 'none']);  

// ruleid: php-session-fixation
$foo->LoadFromExtension('SECURITY', array('SESSION_FIXATION_STRATEGY' => 'NONE'));  

// ruleid: php-session-fixation
$foo->loadFromExtension('security', ['foo' => 'bar', 'session_fixation_strategy' => 'none']);  

// ruleid: php-session-fixation
$array = ['foo' => 'bar', 'session_fixation_strategy' => 'none'];
$foo->loadFromExtension('security', $array); 

// ok: php-session-fixation
$foo->loadFromExtension(['session_fixation_strategy' => 'none'], 'security'); 

// ruleid: php-session-fixation
$foo->loadFromExtension(values:['session_fixation_strategy' => 'none'], extension:'security'); 

// ok: php-session-fixation
$foo->loadFromExtension('security', ['session_fixation_strategy' => 'invalidate']);  

// ok: php-session-fixation
$foo->loadFromExtension('security', ['other_property' => 'none']);  

// ok: php-session-fixation
$foo->loadFromExtension('bar', ['session_fixation_strategy' => 'none']);  

// ok: php-session-fixation
$foo->loadFromExtension('security');  

// ok: php-session-fixation
$foo->loadFromExtension(['session_fixation_strategy' => 'none']);  

// ok: php-session-fixation
$foo->loadFromExtension('security', ['none']);  

// ok: php-session-fixation
$foo->loadFromExtension();  

// ruleid: php-session-fixation
$foo->extension('security', ['session_fixation_strategy' => 'none']);  

// ok: php-session-fixation
$foo->extension('security', ['session_fixation_strategy' => 'invalidate']); 


// ok: php-session-fixation
$foo->extension('foo', ['session_fixation_strategy' => 'none']);  

// ruleid: php-session-fixation
$foo->prependExtensionConfig('security', ['session_fixation_strategy' => 'none']); 

// ruleid: php-session-fixation
$foo->PrependExtensionConfig(config:['session_fixation_strategy' => 'none'], name:'security');  

// ok: php-session-fixation
$foo->prependExtensionConfig(['session_fixation_strategy' => 'none'], 'security'); 

// ok: php-session-fixation
$foo->prependExtensionConfig('security', ['session_fixation_strategy' => 'bar']); 

// ok: php-session-fixation
$foo->other_function_call('security', ['session_fixation_strategy' => 'none']);  