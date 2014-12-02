<?php
/**
* 
* 	@version 	1.0.3  November 25, 2014
* 	@package 	Get Bible API
* 	@author  	Llewellyn van der Merwe <llewellyn@vdm.io>
* 	@copyright	Copyright (C) 2013 Vast Development Method <http://www.vdm.io>
* 	@license	GNU General Public License <http://www.gnu.org/copyleft/gpl.html>
*
**/

defined( '_JEXEC' ) or die( 'Restricted access' );

class GetbibleViewApp extends JViewLegacy
{
	/**
	 * @var bool import success
	 */
	protected $params;
	protected $cpanel;
	protected $AppDefaults;
	protected $bookmarks;

	/**
	 * Display the view
	 */
	public function display($tpl = null)
	{
		// Initialise variables.
		$this->cpanel	= $this->get('Cpanel');
		// get the Book Defaults
		$this->AppDefaults = $this->get('AppDefaults');
		// get the last date a book name was changed
		$this->booksDate = $this->get('BooksDate');
		// Get app Params
		$this->params = JFactory::getApplication()->getParams();
		
		$this->_prepareDocument();
		
		parent::display($tpl);
	}

		
	/**
	 * Prepares the document
	 */
	protected function _prepareDocument()
	{
		// set query options
		$setApp = '';
		
		// set query url
		if ($this->params->get('jsonQueryOptions') == 1){
			
			// Load Jquery check
			if($this->params->get('jsonAPIaccess')){
				
				$key		= JSession::getFormToken();
				$setApp 	.= 	"var appKey = '".$key."';"; 
			}
			
			$jsonUrl 	=  "'index.php?option=com_getbible&view=json'";
			
		} elseif ($this->params->get('jsonQueryOptions') == 2) {
			$setApp 	.= 	"var cPanelUrl = 'https://getbible.net/';";
			$jsonUrl 	=  "'https://getbible.net/json'";
			
		} else {
			$setApp 	.= 	"var cPanelUrl = 'http://getbible.net/';";
			$jsonUrl 	=  "'http://getbible.net/json'";
			
		}
		
		// Get app settings
		//require_once( JPATH_COMPONENT.DS.'helpers'.DS.'jquery_app.php' );
		//require_once( JPATH_COMPONENT.DS.'helpers'.DS.'css_app.php' );
		
		require_once( JPATH_COMPONENT.DS.'helpers'.DS.'script_checker.php' );
		// The css
		$this->document->addStyleSheet(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'css'.DS.'app.css');
		if (!HeaderCheck::css_loaded('uikit')) {
			$this->document->addStyleSheet(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'css'.DS.'uikit.min.css');
		}
		$this->document->addStyleSheet(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'css'.DS.'components'.DS.'sticky.min.css');
		$this->document->addStyleSheet(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'css'.DS.'offline.css');
		
		// The JS
		// Load jQuery check
		if (!HeaderCheck::js_loaded('jquery')) {
			JHtml::_('jquery.ui');
		}
		// set defaults	
		$setApp .=  'var getUrl				= "'.$this->AppDefaults['getUrl'].'";';
		$setApp .=  'var defaultKey 		= "'.$this->AppDefaults['defaultKey'].'";';
		$setApp .=  'var searchApp 			= 0;';
		if($this->AppDefaults['request']){
			$setApp .=  'var defaultRequest		= "'.$this->AppDefaults['request'].'";';
			$setApp .=  'var searchFor 			= 0;';
			$setApp .=  'var searchCrit 		= 0;';
			$setApp .=  'var searchType 		= 0;';
			$setApp .=  'var loadApp 			= 0;';
		} else {
			$setApp .=  'var defaultRequest		= 0;';
		}
		$setApp .= 	'var autoLoadChapter 	= '.$this->params->get('auto_loading_chapter').';';
		$setApp .= 	'var appMode 			= '.$this->params->get('app_mode').';';
		$setApp .= 	'var jsonUrl 			= '.$jsonUrl.';';
		$setApp .= 	'var booksDate 			= "'.$this->booksDate.'";';
		$setApp .= 	'var highlightOption 	= '. $this->params->get('highlight_option').';';// set the search styles
		$setApp .= 	'var verselineMode 		= '. $this->params->get('line_mode').';';
		if($this->params->get('highlight_padding')){
			$padding = 'padding: 0 3px 0 3px;';
		} else {
			$padding = '';
		}
		// verses style
		$versStyles = '	#scripture .verse { cursor: pointer; }
						/* verse sizes */ 
						#scripture .verse_small { font-size: '.$this->params->get('font_small').'px; line-height: 1.5;} 
						#scripture .verse_medium { font-size: '.$this->params->get('font_medium').'px; line-height: 1.5;}
						#scripture .verse_large { font-size: '.$this->params->get('font_large').'px; line-height: 1.5;}
						/* verse nr sizes */ 
						#scripture .nr_small { font-size: '. ($this->params->get('font_small') - 3).'px; line-height: 1.5;} 
						#scripture .nr_medium { font-size: '. ($this->params->get('font_medium') - 4).'px; line-height: 1.5;}
						#scripture .nr_large { font-size: '. ($this->params->get('font_large') - 5).'px; line-height: 1.5;}';
		$this->document->addStyleDeclaration( $versStyles );
		// search highlight style
		$searchStyles = '.highlight { color: '.$this->params->get('highlight_textcolor').'; border-bottom: 1px '.$this->params->get('highlight_linetype').' '.$this->params->get('highlight_linecolor').'; background-color: '.$this->params->get('highlight_background').'; '. $padding .' }';
		$this->document->addStyleDeclaration( $searchStyles );
		// hover styles
		$hoverStyle = '.hoverStyle { color: '.$this->params->get('hover_textcolor').'; border-bottom: 1px '.$this->params->get('hover_linetype').' '.$this->params->get('hover_linecolor').'; background-color: '.$this->params->get('hover_background').'; }';
		$this->document->addStyleDeclaration( $hoverStyle );
		// bookmark styles
		$marks = range('a','m');
		foreach($marks as $mark){
			$this->bookmarks[$mark] =  array(
											'name' => $this->params->get('mark_'.$mark.'_name'), 
											'text' => $this->params->get('mark_'.$mark.'_textcolor'), 
											'background' => $this->params->get('mark_'.$mark.'_background')
											);
			$markStyle = '.bookmark_'.$mark.' { 
								color: '.$this->params->get('mark_'.$mark.'_textcolor').'; 
								border-bottom: 1px '.$this->params->get('mark_'.$mark.'_linetype').' '.$this->params->get('mark_'.$mark.'_linecolor').'; 
								background-color: '.$this->params->get('mark_'.$mark.'_background').'; 
								}';
			$this->document->addStyleDeclaration( $markStyle );
		}
		$this->document->addScript(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'js'.DS.'highlight.js');
		
		$this->document->addScriptDeclaration($setApp);  
		$this->document->addScript(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'js'.DS.'app.js');
		
		// Load Uikit check
		$this->document->addScript(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'js'.DS.'uikit.min.js');
		$this->document->addScript(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'js'.DS.'components'.DS.'sticky.min.js');
		
		// Load Json check
		if (!HeaderCheck::js_loaded('json')) {
			$this->document->addScript(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'js'.DS.'jquery.json.min.js');
		}
		// Load Jstorage check
		if (!HeaderCheck::js_loaded('jstorage')) {
			$this->document->addScript(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'js'.DS.'jstorage.min.js');
		}
		// Load Offline check
		if (!HeaderCheck::js_loaded('offline')) {
			$this->document->addScript(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'js'.DS.'offline.min.js');
		}
		// debug offline status
		// $this->document->addScript(JURI::base( true ) .DS.'media'.DS.'com_getbible'.DS.'js'.DS.'offline-simulate-ui.min.js');
						
		// to check in app is online
		$offline	= '	jQuery(document).ready(function(){ 
							Offline.options = {checks: { image: {url: "/media/com_getbible/images/vdm.png"}, active: "image"}};
							window.setInterval(function() {
								
								if (Offline.state === "up"){
									Offline.check();				
								}
								
							}, 3000);
						});';
		$this->document->addScriptDeclaration($offline);
	}
}
