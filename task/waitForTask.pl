sub waitForTask {
   my ($self, $task_ref, $progesscallbackfunc) = @_;
   my $task_view = $self->{vim}->get_view(mo_ref => $task_ref);
   my $progress = -1;
   while (1) {
      my $info = $task_view->info;
      if ($info->state->val eq 'success') {
         return $info->result;
      } elsif ($info->state->val eq 'error') {
         my $soap_fault = SoapFault->new;
         $soap_fault->name($info->error->fault);
         $soap_fault->detail($info->error->fault);
         my $errorMessage = $info->error->localizedMessage;
         if (defined ($info->error->fault->faultMessage)) {
            my $messages = $info->error->fault->faultMessage;
            if (scalar($messages) > 0 && defined $$messages[0]->message) {
               $errorMessage .= $$messages[0]->message;
            }
         }
         $soap_fault->fault_string($errorMessage);
         # bug 266936, 317279, 275446
         die $soap_fault;
      }
      if(defined $progesscallbackfunc) {
         if(defined $info->progress && $info->progress != $progress) {
            &$progesscallbackfunc($info->progress);
            $progress = $info->progress;
         }
      }
      sleep 2;
      $task_view->update_view_data();
   }
}
