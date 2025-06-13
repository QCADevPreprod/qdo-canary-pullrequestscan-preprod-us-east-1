<?php
use Symfony\Component\HttpFoundation\RedirectResponse;

class WebAppController
{
    public function nonCompliant1(): RedirectResponse
    {
        $foobar = $session->get('foobar');
        // ruleid: php-symfony-non-literal-redirect
        return $this->redirect($foobar);
    }
	

    public function nonCompliant2(): RedirectResponse
    {
        $addr = $request->query->get('page', 1);
        // ruleid: php-symfony-non-literal-redirect
        return $this->redirect('https://'. $addr);
    }

	public function nonCompliant3(): RedirectResponse
    {
        // ruleid: php-symfony-non-literal-redirect
        return $this->redirect();
    }

    public function compliant1(): RedirectResponse
    {
        $foobar = $session->get('foobar');
        // ok: php-symfony-non-literal-redirect
        return $this->redirectToRoute($foobar);
    }

    public function compliant2(): RedirectResponse
    {
        // ok: php-symfony-non-literal-redirect
        return $this->redirect('http://symfony.com/doc');
    }

	public function compliant3(): RedirectResponse
    {
        if ($this->login($data)) {
					if ($this->autoRedirect) {
						// ok: php-symfony-non-literal-redirect
						$controller->redirect($this->redirect(), null, true);
					}
					return true;
		}
		if (App::user()->isAuthenticated()) {
			// ok: php-symfony-non-literal-redirect
			return $this->redirect($redirect);
		}
		if ($this->auth->is_valid())
		{
			// ok: php-symfony-non-literal-redirect
			$this->redirect();
		}
    }

}